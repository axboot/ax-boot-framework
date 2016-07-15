package com.chequer.axboot.core.excel;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.javafunk.excelparser.SheetParser;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class ExcelParser {

    public <T> T parse(InputStream is, String sheetName, Class<T> clazz) throws IOException {
        Sheet sheet = new HSSFWorkbook(is).getSheet(sheetName);

        SheetParser sheetParser = new SheetParser();
        List<T> parsedObject = sheetParser.createEntity(sheet, clazz, e -> {
            e.printStackTrace();
        });

        return parsedObject.get(0);
    }
}
