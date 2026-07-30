package com.university.lostfound.repository;

import com.university.lostfound.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    
    long countByTypeTypeName(String typeName);

    long countByStatusStatusName(String statusName);

    long countByUploadedByUserId(Long userId);

    long countByClaimedByUserId(Long userId);

    List<Item> findByUploadedByUserIdOrderByCreatedAtDesc(Long userId);

    List<Item> findTop6ByIsActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT c.categoryName, COUNT(i) FROM Item i JOIN i.category c GROUP BY c.categoryName")
    List<Object[]> countItemsByCategory();

    @Query("SELECT l.locationName, COUNT(i) FROM Item i JOIN i.location l GROUP BY l.locationName")
    List<Object[]> countItemsByLocation();
}
