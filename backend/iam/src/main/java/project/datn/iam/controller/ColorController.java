package project.datn.iam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.datn.iam.model.Colors;
import project.datn.iam.repository.ColorsRepository;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class ColorController {
    @Autowired
    private ColorsRepository colorsRepository;

    @GetMapping("/colors")
    public List<Colors> getAllColors() {
        return colorsRepository.findAll();
    }
}
