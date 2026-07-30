package com.university.lostfound.service;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.Category;
import com.university.lostfound.entity.Department;
import com.university.lostfound.entity.Location;
import com.university.lostfound.entity.Role;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MasterDataService {

    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ItemTypeRepository itemTypeRepository;
    private final ItemStatusRepository itemStatusRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final DTOMapper dtoMapper;

    public MasterDataService(CategoryRepository categoryRepository,
                             LocationRepository locationRepository,
                             ItemTypeRepository itemTypeRepository,
                             ItemStatusRepository itemStatusRepository,
                             DepartmentRepository departmentRepository,
                             RoleRepository roleRepository,
                             DTOMapper dtoMapper) {
        this.categoryRepository = categoryRepository;
        this.locationRepository = locationRepository;
        this.itemTypeRepository = itemTypeRepository;
        this.itemStatusRepository = itemStatusRepository;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(dtoMapper::toCategoryDTO).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return dtoMapper.toCategoryDTO(categoryRepository.save(category));
    }

    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream().map(dtoMapper::toLocationDTO).collect(Collectors.toList());
    }

    @Transactional
    public LocationDTO createLocation(LocationDTO dto) {
        Location location = new Location();
        location.setLocationName(dto.getLocationName());
        location.setDescription(dto.getDescription());
        location.setBuilding(dto.getBuilding());
        location.setFloorNo(dto.getFloorNo());
        location.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return dtoMapper.toLocationDTO(locationRepository.save(location));
    }

    public List<ItemTypeDTO> getItemTypes() {
        return itemTypeRepository.findAll().stream().map(dtoMapper::toItemTypeDTO).collect(Collectors.toList());
    }

    public List<ItemStatusDTO> getItemStatuses() {
        return itemStatusRepository.findAll().stream().map(dtoMapper::toItemStatusDTO).collect(Collectors.toList());
    }

    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }

    public List<Role> getRoles() {
        return roleRepository.findAll();
    }
}
