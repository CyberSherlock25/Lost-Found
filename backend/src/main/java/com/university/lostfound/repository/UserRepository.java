package com.university.lostfound.repository;

import com.university.lostfound.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUniversityId(String universityId);
    Boolean existsByEmail(String email);
    Boolean existsByUniversityId(String universityId);
    List<User> findByRoleRoleId(Long roleId);
}
