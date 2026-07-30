package com.university.lostfound.config;
import com.university.lostfound.entity.ItemType;
import com.university.lostfound.repository.ItemTypeRepository;
import com.university.lostfound.entity.Category;
import com.university.lostfound.entity.Location;
import com.university.lostfound.repository.CategoryRepository;
import com.university.lostfound.repository.LocationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MasterDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ItemTypeRepository itemTypeRepository;

 
    public MasterDataInitializer(CategoryRepository categoryRepository,
                             LocationRepository locationRepository,
                             ItemTypeRepository itemTypeRepository) {

    this.categoryRepository = categoryRepository;
    this.locationRepository = locationRepository;
    this.itemTypeRepository = itemTypeRepository;
}

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedLocations();
        seedItemTypes();
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) {
            return;
        }

        String[][] categories = {
                {"Electronics", "Electronic gadgets"},
                {"Mobile Phones", "Smartphones and Feature Phones"},
                {"Laptop", "Laptops and Chargers"},
                {"Books", "Academic and Personal Books"},
                {"Wallet", "Wallets and Purses"},
                {"ID Card", "University Identity Cards"},
                {"Keys", "Vehicle and Room Keys"},
                {"Bags", "Backpacks and Handbags"},
                {"Water Bottle", "Bottles and Flasks"},
                {"Clothing", "Jackets, Hoodies, Uniforms"},
                {"Accessories", "Watch, Earbuds, Glasses"},
                {"Documents", "Certificates and Papers"},
                {"Jewellery", "Chains, Rings, Bracelets"},
                {"Sports Equipment", "Sports Accessories"},
                {"Others", "Miscellaneous Items"}
        };

        for (String[] cat : categories) {
            Category category = new Category();
            category.setCategoryName(cat[0]);
            category.setDescription(cat[1]);
            category.setIsActive(true);
            categoryRepository.save(category);
        }
    }
    private void seedItemTypes() {

    if (itemTypeRepository.count() > 0) {
        return; // Already seeded
    }

    ItemType lost = new ItemType();
    lost.setTypeName("LOST");
    lost.setDescription("Items reported as Lost");
    lost.setIsActive(true);
    itemTypeRepository.save(lost);

    ItemType found = new ItemType();
    found.setTypeName("FOUND");
    found.setDescription("Items reported as Found");
    found.setIsActive(true);
    itemTypeRepository.save(found);

    System.out.println("Item Types Seeded Successfully!");
}

    private void seedLocations() {
        if (locationRepository.count() > 0) {
            return;
        }

        Object[][] locations = {
                {"Library", "Central Library", "Library Building", "Ground"},
                {"Computer Lab", "Programming Lab", "IT Block", "First"},
                {"Cafeteria", "Food Court", "Main Building", "Ground"},
                {"Auditorium", "Main Auditorium", "Main Building", "Ground"},
                {"Parking", "Student Parking", "Parking Area", "Ground"},
                {"Sports Ground", "Outdoor Sports", "Sports Complex", "Ground"},
                {"Hostel A", "Boys Hostel", "Hostel", "Ground"},
                {"Hostel B", "Girls Hostel", "Hostel", "Ground"},
                {"Admin Office", "Administration", "Admin Block", "First"},
                {"Reception", "Main Reception", "Main Gate", "Ground"},
                {"Classroom", "Academic Classroom", "Academic Block", "Various"},
                {"Other", "Other Campus Location", null, null}
        };

        for (Object[] loc : locations) {
            Location location = new Location();
            location.setLocationName((String) loc[0]);
            location.setDescription((String) loc[1]);
            location.setBuilding((String) loc[2]);
            location.setFloorNo((String) loc[3]);
            location.setIsActive(true);
            locationRepository.save(location);
        }
    }
}