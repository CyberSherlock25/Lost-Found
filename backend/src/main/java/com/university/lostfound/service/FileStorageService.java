package com.university.lostfound.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Path privateProofStorageLocation;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir,
                              @Value("${app.private-proof.dir:private-proof-uploads}") String privateProofDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.privateProofStorageLocation = Paths.get(privateProofDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.privateProofStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded files.", ex);
        }
    }

    /** Stores ownership evidence outside the publicly served /uploads directory. */
    public String storePrivateProof(MultipartFile file) {
        validateFile(file, "image/jpeg", "image/png", "application/pdf");
        String contentType = file.getContentType();
        String extension = "application/pdf".equalsIgnoreCase(contentType) ? ".pdf"
                : ("image/png".equalsIgnoreCase(contentType) ? ".png" : ".jpg");
        String fileName = UUID.randomUUID() + extension;
        Path target = privateProofStorageLocation.resolve(fileName).normalize();
        if (!target.startsWith(privateProofStorageLocation)) {
            throw new RuntimeException("Invalid proof document path.");
        }
        try (InputStream inputStream = file.getInputStream();
             java.io.OutputStream outputStream = Files.newOutputStream(
                     target, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE)) {
            inputStream.transferTo(outputStream);
            return "private:" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store private proof document.", ex);
        }
    }

    public Resource loadPrivateProof(String storageReference) {
        if (storageReference == null || !storageReference.startsWith("private:")) {
            throw new IllegalArgumentException("This proof document is not stored in private storage.");
        }
        String fileName = storageReference.substring("private:".length());
        Path target = privateProofStorageLocation.resolve(fileName).normalize();
        if (!target.startsWith(privateProofStorageLocation) || !Files.isRegularFile(target)) {
            throw new IllegalArgumentException("Proof document not found.");
        }
        return new FileSystemResource(target);
    }

    public String storeFile(MultipartFile file) {
        validateFile(file, "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf");

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i >= 0) {
            extension = originalFilename.substring(i);
        }
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void validateFile(MultipartFile file, String... allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a valid file to upload.");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds the 10MB limit.");
        }

        String contentType = file.getContentType();
        boolean allowed = contentType != null && java.util.Arrays.stream(allowedContentTypes)
                .anyMatch(contentType::equalsIgnoreCase);
        if (!allowed) {
            throw new RuntimeException("Unsupported file type. Please upload only images or PDFs.");
        }
    }
}
