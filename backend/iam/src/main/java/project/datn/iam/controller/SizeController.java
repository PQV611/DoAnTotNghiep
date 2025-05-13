package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.datn.iam.model.Sizes;
import project.datn.iam.repository.SizesRepository;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class SizeController {
    @Autowired
    private SizesRepository SizesRepository;

    @GetMapping("/sizes")
    public List<Sizes> getAllSizes() {
        return SizesRepository.findAll();
    }
}
