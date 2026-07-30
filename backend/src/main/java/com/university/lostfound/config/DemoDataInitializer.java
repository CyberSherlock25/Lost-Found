package com.university.lostfound.config;

import com.university.lostfound.entity.Department;
import com.university.lostfound.entity.Role;
import com.university.lostfound.entity.User;
import com.university.lostfound.repository.DepartmentRepository;
import com.university.lostfound.repository.RoleRepository;
import com.university.lostfound.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Ensures the accounts advertised on the local demo login page can authenticate. */
@Component
public class DemoDataInitializer implements CommandLineRunner {
    private static final String DEMO_PASSWORD = "Password@123";

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataInitializer(RoleRepository roleRepository, DepartmentRepository departmentRepository,
                               UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Department department = departmentRepository.findByDepartmentName("Computer Science")
                .orElseGet(() -> saveDepartment("Computer Science", "Computer Science Department"));
        upsert("admin@university.edu", "Admin", "User", "ADMIN-001", role("ADMIN", "Platform administrator"), department);
        upsert("security@university.edu", "Security", "Officer", "STAFF-001", role("STAFF", "Security staff"), department);
        upsert("robert.chen@university.edu", "Robert", "Chen", "FAC-001", role("TEACHER", "Faculty member"), department);
        upsert("alex.morgan@university.edu", "Alex", "Morgan", "STD-001", role("STUDENT", "Student"), department);
    }

    private Role role(String name, String description) {
        return roleRepository.findByRoleName(name).orElseGet(() -> {
            Role role = new Role();
            role.setRoleName(name);
            role.setDescription(description);
            return roleRepository.save(role);
        });
    }

    private Department saveDepartment(String name, String description) {
        Department department = new Department();
        department.setDepartmentName(name);
        department.setDescription(description);
        return departmentRepository.save(department);
    }

    private void upsert(String email, String firstName, String lastName, String universityId,
                        Role role, Department department) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUniversityId(universityId);
        user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        user.setRole(role);
        user.setDepartment(department);
        user.setIsActive(true);
        userRepository.save(user);
    }
}
