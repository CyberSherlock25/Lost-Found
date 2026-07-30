package com.university.lostfound.repository;

import com.university.lostfound.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Long> {
    Optional<ItemType> findByTypeName(String typeName);
}
