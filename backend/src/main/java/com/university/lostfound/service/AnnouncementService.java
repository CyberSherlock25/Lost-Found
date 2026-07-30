package com.university.lostfound.service;

import com.university.lostfound.dto.AnnouncementDTO;
import com.university.lostfound.dto.CreateAnnouncementRequest;
import com.university.lostfound.entity.Announcement;
import com.university.lostfound.entity.Role;
import com.university.lostfound.entity.User;
import com.university.lostfound.exception.ResourceNotFoundException;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.AnnouncementRepository;
import com.university.lostfound.repository.RoleRepository;
import com.university.lostfound.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DTOMapper dtoMapper;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               RoleRepository roleRepository,
                               UserRepository userRepository,
                               DTOMapper dtoMapper) {
        this.announcementRepository = announcementRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    public List<AnnouncementDTO> getActiveAnnouncements() {
        return announcementRepository.findByIsActiveTrueOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(dtoMapper::toAnnouncementDTO)
                .collect(Collectors.toList());
    }

    public List<AnnouncementDTO> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(dtoMapper::toAnnouncementDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AnnouncementDTO createAnnouncement(String posterEmail, CreateAnnouncementRequest request) {
        User postedBy = userRepository.findByEmail(posterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + posterEmail));

        Role targetRole = null;
        if (request.getTargetRoleId() != null) {
            targetRole = roleRepository.findById(request.getTargetRoleId()).orElse(null);
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setMessage(request.getMessage());
        announcement.setPostedBy(postedBy);
        announcement.setTargetRole(targetRole);
        announcement.setStartDate(request.getStartDate());
        announcement.setEndDate(request.getEndDate());
        announcement.setIsPinned(request.getIsPinned() != null ? request.getIsPinned() : false);
        announcement.setIsActive(true);

        return dtoMapper.toAnnouncementDTO(announcementRepository.save(announcement));
    }

    @Transactional
    public void deleteAnnouncement(Long announcementId) {
        Announcement announcement = announcementRepository.findById(announcementId)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement not found: " + announcementId));
        announcementRepository.delete(announcement);
    }
}
