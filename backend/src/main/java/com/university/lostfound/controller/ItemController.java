package com.university.lostfound.controller;

import com.university.lostfound.dto.*;
import com.university.lostfound.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ItemDTO>> createItem(Authentication authentication,
                                                           @Valid @RequestBody CreateItemRequest request) {
        ItemDTO item = itemService.createItem(authentication.getName(), request);
        return new ResponseEntity<>(ApiResponse.success("Item created successfully", item), HttpStatus.CREATED);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ApiResponse<ItemDTO>> getItemById(@PathVariable Long itemId) {
        ItemDTO item = itemService.getItemById(itemId);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ItemDTO>>> searchItems(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) Long typeId,
            @RequestParam(required = false) Long statusId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        PagedResponse<ItemDTO> pagedResponse = itemService.searchItems(
                query, categoryId, locationId, typeId, statusId, brand, color, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(pagedResponse));
    }

    @PatchMapping("/{itemId}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<ItemDTO>> updateItemStatus(@PathVariable Long itemId,
                                                                 @Valid @RequestBody UpdateItemStatusRequest request) {
        ItemDTO item = itemService.updateItemStatus(itemId, request);
        return ResponseEntity.ok(ApiResponse.success("Item status updated", item));
    }

    @PatchMapping("/{itemId}/verify")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<ItemDTO>> verifyItem(@PathVariable Long itemId, Authentication authentication) {
        ItemDTO item = itemService.verifyItem(itemId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Item verified", item));
    }

    @PatchMapping("/{itemId}/toggle-claimable")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<ApiResponse<ItemDTO>> toggleClaimable(@PathVariable Long itemId) {
        ItemDTO item = itemService.toggleClaimable(itemId);
        return ResponseEntity.ok(ApiResponse.success("Claimable status updated", item));
    }

    @PostMapping("/{itemId}/images")
    public ResponseEntity<ApiResponse<ItemImageDTO>> uploadImage(@PathVariable Long itemId,
                                                                 @RequestParam("file") MultipartFile file) {
        ItemImageDTO imageDTO = itemService.uploadImage(itemId, file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", imageDTO));
    }
}
