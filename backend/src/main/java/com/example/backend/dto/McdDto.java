package com.example.backend.dto;

import java.util.List;

public record McdDto(
    List<EntityDto> entities,
    List<AssociationDto> associations,
    List<LinkDto> links
) {
    public record EntityDto(
        String id,
        String name,
        List<PropertyDto> properties
    ) {}

    public record AssociationDto(
        String id,
        String name,
        List<PropertyDto> properties
    ) {}

    public record PropertyDto(
        String id,
        String name,
        String type,
        boolean isIdentifier
    ) {}

    public record LinkDto(
        String id,
        String entityId,
        String associationId,
        String cardMin,
        String cardMax,
        boolean relative
    ) {}
}
