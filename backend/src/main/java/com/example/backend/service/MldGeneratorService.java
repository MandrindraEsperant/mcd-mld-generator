package com.example.backend.service;

import com.example.backend.dto.McdDto;
import com.example.backend.dto.MldDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MldGeneratorService {

    public MldDto generateMld(McdDto mcd) {
        List<MldDto.TableDto> tables = new ArrayList<>();
        Map<String, MldDto.TableDto> tableMap = new HashMap<>();
        Map<String, McdDto.EntityDto> entityMap = new HashMap<>();

        if (mcd.entities() != null) {
            // 1. Entities to Tables
            for (McdDto.EntityDto entity : mcd.entities()) {
                entityMap.put(entity.id(), entity);
                List<MldDto.ColumnDto> columns = new ArrayList<>();
                if (entity.properties() != null) {
                    for (McdDto.PropertyDto prop : entity.properties()) {
                        columns.add(new MldDto.ColumnDto(
                            formatName(prop.name()),
                            prop.type() != null && !prop.type().isEmpty() ? prop.type() : "VARCHAR(255)",
                            prop.isIdentifier(),
                            !prop.isIdentifier(),
                            false
                        ));
                    }
                }
                MldDto.TableDto table = new MldDto.TableDto(formatName(entity.name()), columns, new ArrayList<>());
                tables.add(table);
                tableMap.put(entity.id(), table);
            }
        }

        if (mcd.associations() != null) {
            // 2. Associations
            for (McdDto.AssociationDto assoc : mcd.associations()) {
                List<McdDto.LinkDto> assocLinks = mcd.links() != null ? mcd.links().stream()
                    .filter(l -> l.associationId().equals(assoc.id()))
                    .toList() : Collections.emptyList();

                if (assocLinks.size() == 2) {
                    McdDto.LinkDto link1 = assocLinks.get(0);
                    McdDto.LinkDto link2 = assocLinks.get(1);

                    boolean isLink1Many = link1.cardMax() != null && link1.cardMax().equalsIgnoreCase("n");
                    boolean isLink2Many = link2.cardMax() != null && link2.cardMax().equalsIgnoreCase("n");

                    if (isLink1Many && isLink2Many) {
                        // Many-to-Many: Create Join Table
                        tables.add(createJoinTable(assoc, link1, link2, entityMap));
                    } else if (!isLink1Many && isLink2Many) {
                        // One-to-Many (link1 is 1, link2 is n)
                        // Foreign key goes to entity1
                        addForeignKeyAndProperties(tableMap.get(link1.entityId()), entityMap.get(link2.entityId()), assoc);
                    } else if (isLink1Many && !isLink2Many) {
                        // Many-to-One
                        addForeignKeyAndProperties(tableMap.get(link2.entityId()), entityMap.get(link1.entityId()), assoc);
                    } else {
                        // One-to-One
                        addForeignKeyAndProperties(tableMap.get(link1.entityId()), entityMap.get(link2.entityId()), assoc);
                    }
                }
            }
        }

        return new MldDto(tables);
    }

    private MldDto.TableDto createJoinTable(McdDto.AssociationDto assoc, McdDto.LinkDto link1, McdDto.LinkDto link2, Map<String, McdDto.EntityDto> entityMap) {
        McdDto.EntityDto e1 = entityMap.get(link1.entityId());
        McdDto.EntityDto e2 = entityMap.get(link2.entityId());

        List<MldDto.ColumnDto> columns = new ArrayList<>();
        List<MldDto.ForeignKeyDto> fks = new ArrayList<>();

        String e1IdCol = getIdentifierCol(e1);
        String fk1Name = formatName(e1.name()) + "_" + e1IdCol;
        columns.add(new MldDto.ColumnDto(fk1Name, getIdentifierType(e1), true, false, false));
        fks.add(new MldDto.ForeignKeyDto(fk1Name, formatName(e1.name()), e1IdCol));

        String e2IdCol = getIdentifierCol(e2);
        String fk2Name = formatName(e2.name()) + "_" + e2IdCol;
        columns.add(new MldDto.ColumnDto(fk2Name, getIdentifierType(e2), true, false, false));
        fks.add(new MldDto.ForeignKeyDto(fk2Name, formatName(e2.name()), e2IdCol));

        if (assoc.properties() != null) {
            for (McdDto.PropertyDto prop : assoc.properties()) {
                columns.add(new MldDto.ColumnDto(
                    formatName(prop.name()),
                    prop.type() != null && !prop.type().isEmpty() ? prop.type() : "VARCHAR(255)",
                    prop.isIdentifier(),
                    !prop.isIdentifier(),
                    false
                ));
            }
        }

        return new MldDto.TableDto(formatName(assoc.name()), columns, fks);
    }

    private void addForeignKeyAndProperties(MldDto.TableDto targetTable, McdDto.EntityDto sourceEntity, McdDto.AssociationDto assoc) {
        if (targetTable == null || sourceEntity == null) return;
        
        String sourceIdCol = getIdentifierCol(sourceEntity);
        String fkName = formatName(sourceEntity.name()) + "_" + sourceIdCol;
        
        targetTable.columns().add(new MldDto.ColumnDto(fkName, getIdentifierType(sourceEntity), false, true, false));
        targetTable.foreignKeys().add(new MldDto.ForeignKeyDto(fkName, formatName(sourceEntity.name()), sourceIdCol));

        if (assoc.properties() != null) {
            for (McdDto.PropertyDto prop : assoc.properties()) {
                targetTable.columns().add(new MldDto.ColumnDto(
                    formatName(prop.name()),
                    prop.type() != null && !prop.type().isEmpty() ? prop.type() : "VARCHAR(255)",
                    false,
                    true,
                    false
                ));
            }
        }
    }

    private String getIdentifierCol(McdDto.EntityDto entity) {
        if (entity.properties() == null) return "id";
        return entity.properties().stream()
            .filter(McdDto.PropertyDto::isIdentifier)
            .map(p -> formatName(p.name()))
            .findFirst()
            .orElse("id");
    }

    private String getIdentifierType(McdDto.EntityDto entity) {
        if (entity.properties() == null) return "INT";
        return entity.properties().stream()
            .filter(McdDto.PropertyDto::isIdentifier)
            .map(p -> p.type() != null && !p.type().isEmpty() ? p.type() : "INT")
            .findFirst()
            .orElse("INT");
    }

    private String formatName(String name) {
        if (name == null) return "unknown";
        return name.replaceAll("[^a-zA-Z0-9_]", "").toLowerCase();
    }
}
