package com.example.backend.dto;

import java.util.List;

public record MldDto(
    List<TableDto> tables
) {
    public record TableDto(
        String name,
        List<ColumnDto> columns,
        List<ForeignKeyDto> foreignKeys
    ) {}

    public record ColumnDto(
        String name,
        String type,
        boolean isPrimaryKey,
        boolean isNullable,
        boolean isUnique
    ) {}

    public record ForeignKeyDto(
        String columnName,
        String targetTable,
        String targetColumn
    ) {}
}
