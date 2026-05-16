package com.example.backend.controller;

import com.example.backend.dto.GenerationResultDto;
import com.example.backend.dto.McdDto;
import com.example.backend.dto.MldDto;
import com.example.backend.service.MldGeneratorService;
import com.example.backend.service.SqlGeneratorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/generate")
@CrossOrigin(origins = "*") // Allow frontend
public class GeneratorController {

    private final MldGeneratorService mldService;
    private final SqlGeneratorService sqlService;

    public GeneratorController(MldGeneratorService mldService, SqlGeneratorService sqlService) {
        this.mldService = mldService;
        this.sqlService = sqlService;
    }

    @PostMapping
    public GenerationResultDto generate(@RequestBody McdDto mcd) {
        MldDto mld = mldService.generateMld(mcd);
        String sql = sqlService.generateSql(mld);
        return new GenerationResultDto(mld, sql);
    }
}
