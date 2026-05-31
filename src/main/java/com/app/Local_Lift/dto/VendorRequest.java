package com.app.Local_Lift.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorRequest {

    private String name;
    private String category;
    private String city;
    private String address;
    private String phone;
    private String description;
}