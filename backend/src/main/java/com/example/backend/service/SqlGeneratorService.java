package com.example.backend.service;

import com.example.backend.dto.MldDto;
import org.springframework.stereotype.Service;

@Service
public class SqlGeneratorService {

    public String generateSql(MldDto mld) {
        StringBuilder sql = new StringBuilder();

        if (mld.tables() == null) return "";

        for (MldDto.TableDto table : mld.tables()) {
            sql.append("CREATE TABLE ").append(table.name()).append(" (\n");

            int colCount = table.columns() != null ? table.columns().size() : 0;
            for (int i = 0; i < colCount; i++) {
                MldDto.ColumnDto col = table.columns().get(i);
                sql.append("    ").append(col.name()).append(" ").append(col.type());
                
                if (col.isPrimaryKey()) {
                    sql.append(" PRIMARY KEY");
                } else if (!col.isNullable()) {
                    sql.append(" NOT NULL");
                }
                
                if (col.isUnique() && !col.isPrimaryKey()) {
                    sql.append(" UNIQUE");
                }

                if (i < colCount - 1 || (table.foreignKeys() != null && !table.foreignKeys().isEmpty())) {
                    sql.append(",");
                }
                sql.append("\n");
            }

            int fkCount = table.foreignKeys() != null ? table.foreignKeys().size() : 0;
            for (int i = 0; i < fkCount; i++) {
                MldDto.ForeignKeyDto fk = table.foreignKeys().get(i);
                sql.append("    FOREIGN KEY (").append(fk.columnName()).append(") ")
                   .append("REFERENCES ").append(fk.targetTable()).append("(").append(fk.targetColumn()).append(")");
                
                if (i < fkCount - 1) {
                    sql.append(",");
                }
                sql.append("\n");
            }

            sql.append(");\n\n");
        }

        return sql.toString();
    }
}
