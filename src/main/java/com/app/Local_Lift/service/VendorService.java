package com.app.Local_Lift.service;

import com.app.Local_Lift.model.Vendor;
import com.app.Local_Lift.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor saveVendor(Vendor vendor) {

        vendor.setTrustScore(80);
        vendor.setVerified(false);
        vendor.setTrending(false);
        vendor.setOpen(true);

        return vendorRepository.save(vendor);
    }
}
