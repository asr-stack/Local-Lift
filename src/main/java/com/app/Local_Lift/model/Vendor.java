package com.app.Local_Lift.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendors")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private String city;

    private String address;

    private String phone;

    @Column(length = 2000)
    private String description;

    private Integer trustScore;

    private Boolean verified;

    private Boolean trending;

    private Boolean open;
}