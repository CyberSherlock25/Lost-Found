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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemStatusRepository itemStatusRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final DTOMapper dtoMapper;
    private final NotificationService notificationService;

    public ItemService(ItemRepository itemRepository,
                       CategoryRepository categoryRepository,
                       LocationRepository locationRepository,
                       ItemTypeRepository itemTypeRepository,
                       ItemStatusRepository itemStatusRepository,
                       UserRepository userRepository,
                       FileStorageService fileStorageService,
                       DTOMapper dtoMapper,
                       NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.itemTypeRepository = itemTypeRepository;
        this.itemStatusRepository = itemStatusRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.dtoMapper = dtoMapper;
        this.notificationService = notificationService;
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

        // Only trusted operational roles can bypass verification.
        String roleName = normalizeRoleName(user);
        if ("ADMIN".equals(roleName) || "STAFF".equals(roleName)) {
            item.setIsVerified(true);
            item.setVerifiedBy(user);
        } else {
            item.setIsVerified(false);
            itemStatusRepository.findByStatusName("UNDER_REVIEW").ifPresent(item::setStatus);
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
        if (!Boolean.TRUE.equals(item.getIsVerified())) {
            notificationService.sendNotificationToRoles(
                    user,
                    List.of("TEACHER", "ADMIN"),
                    savedItem.getItemId(),
                    "Item Approval Required",
                    "A new " + type.getTypeName().toLowerCase() + " item requires verification: " + item.getTitle(),
                    "ITEM_PENDING_VERIFICATION"
            );
        }
        return dtoMapper.toItemDTO(savedItem);
    }

    public ItemDTO getItemById(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        if (!Boolean.TRUE.equals(item.getIsActive()) || !Boolean.TRUE.equals(item.getIsVerified())) {
            throw new ResourceNotFoundException("Item not found with ID: " + itemId);
        }
        return dtoMapper.toItemDTO(item);
    }

    public List<ItemDTO> getPendingApprovals() {
        return itemRepository.findByIsVerifiedFalseAndIsActiveTrueOrderByCreatedAtAsc()
                .stream()
                .map(dtoMapper::toItemDTO)
                .collect(Collectors.toList());
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

        if (page < 0) {
            throw new BadRequestException("Page number cannot be negative.");
        }
        if (size < 1 || size > 100) {
            throw new BadRequestException("Page size must be between 1 and 100.");
        }
        Set<String> allowedSortFields = Set.of("createdAt", "title", "dateLost", "dateFound");
        if (!allowedSortFields.contains(sortBy)) {
            throw new BadRequestException("Unsupported sort field: " + sortBy);
        }

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Item> spec = (root, q, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("isActive"), true));
            predicates.add(criteriaBuilder.equal(root.get("isVerified"), true));

            if (StringUtils.hasText(query)) {
                String pattern = "%" + query.toLowerCase(Locale.ROOT) + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern);
                Predicate brandMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), pattern);
                Predicate colorMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("color")), pattern);
                Predicate serialMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("serialNumber")), pattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch, brandMatch, colorMatch, serialMatch));
            }
            if (categoryId != null) predicates.add(criteriaBuilder.equal(root.get("category").get("categoryId"), categoryId));
            if (locationId != null) predicates.add(criteriaBuilder.equal(root.get("location").get("locationId"), locationId));
            if (typeId != null) predicates.add(criteriaBuilder.equal(root.get("type").get("typeId"), typeId));
            if (statusId != null) predicates.add(criteriaBuilder.equal(root.get("status").get("statusId"), statusId));
            if (StringUtils.hasText(brand)) predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase(Locale.ROOT)));
            if (StringUtils.hasText(color)) predicates.add(criteriaBuilder.equal(criteriaBuilder.lower(root.get("color")), color.toLowerCase(Locale.ROOT)));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Item> itemPage = itemRepository.findAll(spec, pageable);
        List<ItemDTO> dtos = itemPage.getContent().stream().map(dtoMapper::toItemDTO).collect(Collectors.toList());
        return new PagedResponse<>(dtos, itemPage.getNumber(), itemPage.getSize(), itemPage.getTotalElements(),
                itemPage.getTotalPages(), itemPage.isLast());
    }

    @Transactional
    public ItemDTO updateItemStatus(Long itemId, UpdateItemStatusRequest request) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        ItemStatus status = itemStatusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Item status not found with ID: " + request.getStatusId()));
        item.setStatus(status);
        if (request.getRemarks() != null) item.setRemarks(request.getRemarks());
        return dtoMapper.toItemDTO(itemRepository.save(item));
    }

    @Transactional
    public ItemDTO verifyItem(Long itemId, String verifierEmail) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));

        if (Boolean.TRUE.equals(item.getIsVerified())) {
            throw new BadRequestException("This item has already been verified.");
        }
        if (!Boolean.TRUE.equals(item.getIsActive())) {
            throw new BadRequestException("An inactive item cannot be verified.");
        }

        User verifier = userRepository.findByEmail(verifierEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Verifier user not found"));

        // Verification must also move a pending item into the public, claimable workflow.
        ItemStatus openStatus = itemStatusRepository.findByStatusName("OPEN")
                .orElseThrow(() -> new BadRequestException("OPEN item status is not configured."));

        item.setIsVerified(true);
        item.setVerifiedBy(verifier);
        item.setStatus(openStatus);

        Item verifiedItem = itemRepository.save(item);
        notificationService.sendNotification(verifier, item.getUploadedBy(), item.getItemId(), null, "Item Verified",
                "Your item '" + item.getTitle() + "' has been verified and is now publicly visible.", "ITEM_FOUND");
        return dtoMapper.toItemDTO(verifiedItem);
    }

    @Transactional
    public ItemDTO toggleClaimable(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        item.setIsClaimable(!Boolean.TRUE.equals(item.getIsClaimable()));
        return dtoMapper.toItemDTO(itemRepository.save(item));
    }

    /**
     * Owners can upload photos for their own items; admins/staff can assist.
     * Uploads are restricted to image content types and a 10 MB limit.
     */
    @Transactional
    public ItemImageDTO uploadImage(Long itemId, String userEmail, MultipartFile file) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with ID: " + itemId));
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isOwner = item.getUploadedBy() != null && item.getUploadedBy().getUserId() != null
                && item.getUploadedBy().getUserId().equals(requester.getUserId());
        String roleName = normalizeRoleName(requester);
        boolean isReviewer = "ADMIN".equals(roleName) || "STAFF".equals(roleName);
        if (!isOwner && !isReviewer) {
            throw new AccessDeniedException("You are not allowed to upload images for this item.");
        }
        if (!Boolean.TRUE.equals(item.getIsActive())) {
            throw new BadRequestException("Images cannot be added to an inactive item.");
        }
        if (file == null || file.isEmpty()) throw new BadRequestException("Please select an image to upload.");
        if (file.getSize() > 10L * 1024 * 1024) throw new BadRequestException("Image size must not exceed 10MB.");

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Unsupported image type. Use JPEG, PNG, WEBP, or GIF.");
        }

        String imageUrl = fileStorageService.storeFile(file);
        ItemImage image = new ItemImage();
        image.setImageUrl(imageUrl);
        image.setImageName(StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "image"));
        image.setImageType(contentType);
        image.setImageSize(file.getSize());
        image.setIsPrimary(item.getImages().isEmpty());
        image.setDisplayOrder(item.getImages().size() + 1);
        item.addImage(image);
        itemRepository.save(item);
        return dtoMapper.toItemImageDTO(image);
    }

    private String normalizeRoleName(User user) {
        if (user == null || user.getRole() == null || user.getRole().getRoleName() == null) return "";
        String roleName = user.getRole().getRoleName().trim().toUpperCase(Locale.ROOT);
        return roleName.startsWith("ROLE_") ? roleName.substring(5) : roleName;
    }
}
