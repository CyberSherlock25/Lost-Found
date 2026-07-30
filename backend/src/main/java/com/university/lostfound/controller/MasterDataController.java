package com.university.lostfound.controller;

import com.university.lostfound.dto.*;
import com.university.lostfound.entity.Department;
import com.university.lostfound.entity.Role;
import com.university.lostfound.service.MasterDataService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MasterDataController {

    private final MasterDataService masterDataService;

    public MasterDataController(MasterDataService masterDataService) {
        this.masterDataService = masterDataService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getAllCategories()));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        return new ResponseEntity<>(ApiResponse.success("Category created", masterDataService.createCategory(categoryDTO)), HttpStatus.CREATED);
    }

    @GetMapping("/locations")
    public ResponseEntity<ApiResponse<List<LocationDTO>>> getLocations() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getAllLocations()));
    }

    @PostMapping("/locations")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LocationDTO>> createLocation(@Valid @RequestBody LocationDTO locationDTO) {
        return new ResponseEntity<>(ApiResponse.success("Location created", masterDataService.createLocation(locationDTO)), HttpStatus.CREATED);
    }

    @GetMapping("/master/item-types")
    public ResponseEntity<ApiResponse<List<ItemTypeDTO>>> getItemTypes() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getItemTypes()));
    }

    @GetMapping("/master/item-statuses")
    public ResponseEntity<ApiResponse<List<ItemStatusDTO>>> getItemStatuses() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getItemStatuses()));
    }

    @GetMapping("/master/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getDepartments()));
    }

    @GetMapping("/master/roles")
    public ResponseEntity<ApiResponse<List<Role>>> getRoles() {
        return ResponseEntity.ok(ApiResponse.success(masterDataService.getRoles()));
    }
}
