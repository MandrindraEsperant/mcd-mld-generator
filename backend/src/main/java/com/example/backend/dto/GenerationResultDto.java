package com.example.backend.dto;

public record GenerationResultDto(
    MldDto mld,
    String sql
) {}
