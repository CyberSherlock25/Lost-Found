package com.university.lostfound.service;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.*;
import com.university.lostfound.exception.BadRequestException;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemStatusRepository itemStatusRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final DTOMapper dtoMapper;

    public ItemService(ItemRepository itemRepository,
                       CategoryRepository categoryRepository,
                       LocationRepository locationRepository,
                       ItemTypeRepository itemTypeRepository,
                       ItemStatusRepository itemStatusRepository,
                       UserRepository userRepository,
                       FileStorageService fileStorageService,
                       DTOMapper dtoMapper) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.itemTypeRepository = itemTypeRepository;
        this.itemStatusRepository = itemStatusRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public ItemDTO createItem(String userEmail, CreateItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with ID: " + request.getLocationId()));

        ItemType type = itemTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Item type not found with ID: " + request.getTypeId()));

        ItemStatus status = itemStatusRepository.findByStatusName("OPEN")
                .orElseGet(() -> itemStatusRepository.findAll().get(0));

        Item item = new Item();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setCategory(category);
        item.setLocation(location);
        item.setType(type);
        item.setStatus(status);
        item.setUploadedBy(user);
        item.setBrand(request.getBrand());
        item.setColor(request.getColor());
        item.setSerialNumber(request.getSerialNumber());
        item.setItemCondition(request.getItemCondition());
        item.setDateLost(request.getDateLost());
        item.setDateFound(request.getDateFound());
        item.setRemarks(request.getRemarks());
        item.setIsClaimable(request.getIsClaimable() != null ? request.getIsClaimable() : true);
        item.setIsActive(true);

        // Auto verify if uploaded by Security / Admin / Staff
        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "";
        if ("ADMIN".equals(roleName) || "STAFF".equals(roleName) || "ROLE_ADMIN".equals(roleName) || "ROLE_STAFF".equals(roleName)) {
            item.setIsVerified(true);
            item.setVerifiedBy(user);
        } else {
            item.setIsVerified(false);
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            int order = 1;
            for (String url : request.getImageUrls()) {
                ItemImage img = new ItemImage();
                img.setImageUrl(url);
                img.setIsPrimary(order == 1);
                img.setDisplayOrder(order++);
                item.addImage(img);
            }
        }

        Item savedItem = itemRepository.save(item);
        return dtoMapper.toItemDTO(savedItem);
    }

    public ItemDTO getItemById(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        return dtoMapper.toItemDTO(item);
    }

    public PagedResponse<ItemDTO> searchItems(
            String query,
            Long categoryId,
            Long locationId,
            Long typeId,
            Long statusId,
            String brand,
            String color,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Item> spec = (root, q, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("isActive"), true));

            if (StringUtils.hasText(query)) {
                String pattern = "%" + query.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern);
                Predicate brandMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), pattern);
                Predicate colorMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("color")), pattern);
                Predicate serialMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("serialNumber")), pattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch, brandMatch, colorMatch, serialMatch));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("categoryId"), categoryId));
            }

            if (locationId != null) {
                predicates.add(criteriaBuilder.equal(root.get("location").get("locationId"), locationId));
            }

            if (typeId != null) {
                predicates.add(criteriaBuilder.equal(root.get("type").get("typeId"), typeId));
            }

            if (statusId != null) {
                predicates.add(criteriaBuilder.equal(root.get("status").get("statusId"), statusId));
            }

            if (StringUtils.hasText(brand)) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase()));
            }

            if (StringUtils.hasText(color)) {
                predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("color")), color.toLowerCase()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Item> itemPage = itemRepository.findAll(spec, pageable);
        List<ItemDTO> dtos = itemPage.getContent().stream().map(dtoMapper::toItemDTO).collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                itemPage.getNumber(),
                itemPage.getSize(),
                itemPage.getTotalElements(),
                itemPage.getTotalPages(),
                itemPage.isLast()
        );
    }

    @Transactional
    public ItemDTO updateItemStatus(Long itemId, UpdateItemStatusRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));

        ItemStatus status = itemStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Item status not found with ID: " + request.getStatusId()));

        item.setStatus(status);
        if (request.getRemarks() != null) {
            item.setRemarks(request.getRemarks());
        }

        return dtoMapper.toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public ItemDTO verifyItem(Long itemId, String verifierEmail) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        User verifier = userRepository.findByEmail(verifierEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Verifier user not found"));

        item.setIsVerified(true);
        item.setVerifiedBy(verifier);
        return dtoMapper.toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public ItemDTO toggleClaimable(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));

        item.setIsClaimable(!Boolean.TRUE.equals(item.getIsClaimable()));
        return dtoMapper.toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public ItemImageDTO uploadImage(Long itemId, MultipartFile file) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));

        String imageUrl = fileStorageService.storeFile(file);

        ItemImage image = new ItemImage();
        image.setImageUrl(imageUrl);
        image.setImageName(file.getOriginalFilename());
        image.setImageType(file.getContentType());
        image.setImageSize(file.getSize());
        image.setIsPrimary(item.getImages().isEmpty());
        image.setDisplayOrder(item.getImages().size() + 1);

        item.addImage(image);
        itemRepository.save(item);

        return dtoMapper.toItemImageDTO(image);
    }
}
