package com.chequer.axboot.core.domain.manual;

import com.chequer.axboot.core.domain.BaseService;
import com.chequer.axboot.core.domain.file.CommonFile;
import com.chequer.axboot.core.domain.file.CommonFileService;
import com.chequer.axboot.core.parameter.RequestParams;
import com.querydsl.core.BooleanBuilder;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.zeroturnaround.zip.ZipUtil;

import javax.inject.Inject;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


@Service
public class ManualService extends BaseService<Manual, Long> {
    private ManualRepository manualRepository;

    @Inject
    private CommonFileService commonFileService;

    @Inject
    public ManualService(ManualRepository manualRepository) {
        super(manualRepository);
        this.manualRepository = manualRepository;
    }

    public List<Manual> get(RequestParams<Manual> requestParams) {
        String manualGrpCd = requestParams.getString("manualGrpCd", "");
        boolean menuOpen = requestParams.getBoolean("menuOpen", true);

        BooleanBuilder builder = new BooleanBuilder();

        if (isNotEmpty(manualGrpCd)) {
            builder.and(qManual.manualGrpCd.eq(manualGrpCd));
        }

        List<Manual> manualList = select().from(qManual).where(builder).orderBy(qManual.level.asc(), qManual.sort.asc()).fetch();

        List<Manual> hierarchyList = new ArrayList<>();

        for (Manual manual : manualList) {
            manual.setOpen(menuOpen);

            Manual parent = getParent(hierarchyList, manual);

            if (parent == null) {
                hierarchyList.add(manual);
            } else {
                parent.addChildren(manual);
            }
        }

        return hierarchyList;
    }

    @Transactional
    public void uploadZip(File zip, String manualGrpCd) throws IOException {
        List<Manual> manuals = new ArrayList<>();
        File destFile = File.createTempFile("upload_", Long.toString(System.nanoTime()));
        ZipUtil.unpack(zip, destFile);
        dirToManualList(manuals, destFile.listFiles(), 0, null, manualGrpCd);
    }

    @Transactional
    public void dirToManualList(List<Manual> manualList, File[] files, int level, Long parentId, String manualGrpCd) throws IOException {
        int sort = 0;
        for (File file : files) {
            if (isValidDirOrFile(file)) {
                Manual manual = new Manual();
                manual.setManualNm(file.getName());
                manual.setSort(sort++);
                manual.setLevel(level);
                manual.setParentId(parentId);
                manual.setManualGrpCd(manualGrpCd);

                save(manual);
                manualList.add(manual);

                if (file.isDirectory()) {
                    dirToManualList(manual.getChildren(), file.listFiles(), level + 1, manual.getId(), manualGrpCd);
                } else {
                    manual.setContent(FileUtils.readFileToString(file, "UTF-8"));
                    save(manual);
                }
            }
        }
    }

    public boolean isValidDirOrFile(File file) {
        return file != null && !file.getName().startsWith(".") && !file.getName().startsWith("__");
    }

    public Manual getParent(List<Manual> manuals, Manual manual) {
        Manual parent = manuals.stream().filter(m -> m.getId().equals(manual.getParentId())).findAny().orElse(null);

        if (parent == null) {
            for (Manual _manual : manuals) {
                parent = getParent(_manual.getChildren(), manual);

                if (parent != null)
                    break;
            }
        }
        return parent;
    }

    @Transactional
    public void saveOrDelete(ManualRequestVO vo) {
        process(vo.getList());
        deleteManual(vo.getDeletedList());
    }

    @Transactional
    public void update(List<Manual> manuals) {
        manuals.forEach(manual -> {
            if (!manual.isNew()) {
                Manual exist = findOne(manual.getId());
                manual.setManualNm(exist.getManualNm());
                manual.setManualKey(exist.getManualKey());
                manual.setContent(exist.getContent());
            }

            save(manual);
        });
    }

    @Transactional
    public void process(List<Manual> manuals) {
        manuals.stream().filter(manual -> manual.getLevel() == 0).forEach(manual -> manual.setParentId(null));
        update(manuals);

        manuals.stream().filter(manual -> isNotEmpty(manual.getChildren())).forEach(menu -> {
            menu.getChildren().forEach(m -> m.setParentId(menu.getId()));
            process(menu.getChildren());
        });
    }

    @Transactional
    public void deleteManual(List<Manual> manuals) {
        delete(manuals);
        manuals.stream().filter(menu -> isNotEmpty(menu.getChildren())).forEach(menu -> {
            deleteManual(menu.getChildren());
        });
    }

    @Transactional
    public Manual uploadFile(Long id, MultipartFile uploadFile) throws IOException {
        File file = commonFileService.multiPartFileToFile(uploadFile);

        Manual manual = findOne(id);
        try {
            if (FilenameUtils.getExtension(file.getName()).toLowerCase().equals("pdf")) {
                System.setProperty("sun.java2d.cmm", "sun.java2d.cmm.kcms.KcmsServiceProvider");

                PDDocument document = PDDocument.load(file);

                PDType0Font.load(document, getClass().getResourceAsStream("/font/NotoSans-Bold.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NotoSans-BoldItalic.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NotoSans-Italic.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NotoSans-Regular.ttf"));

                PDType0Font.load(document, getClass().getResourceAsStream("/font/NanumGothic.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NanumGothicBold.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NanumGothicExtraBold.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/NanumGothicLight.ttf"));

                PDType0Font.load(document, getClass().getResourceAsStream("/font/malgun.ttf"));
                PDType0Font.load(document, getClass().getResourceAsStream("/font/malgunbd.ttf"));

                PDFRenderer pdfRenderer = new PDFRenderer(document);

                String tmp = System.getProperty("java.io.tmpdir");

                StringBuilder stringBuilder = new StringBuilder();

                for (int page = 0; page < document.getNumberOfPages(); ++page) {
                    String tmpFileName = tmp + "/" + System.nanoTime() + ".jpg";

                    BufferedImage originImage = pdfRenderer.renderImageWithDPI(page, 720, ImageType.RGB);

                    int width = 2048;
                    int height = (originImage.getHeight() * width) / originImage.getWidth();

                    BufferedImage outputImage = new BufferedImage(width, height, originImage.getType());

                    Graphics2D g2d = outputImage.createGraphics();
                    g2d.drawImage(originImage, 0, 0, width, height, null);
                    g2d.dispose();

                    ImageIOUtil.writeImage(outputImage, tmpFileName, 720);

                    CommonFile commonFile = commonFileService.upload(new File(tmpFileName), "MANUAL_CONTENT", Long.toString(id), page);

                    stringBuilder.append("<img src=\"").append(commonFile.preview()).append("\" style='width:100%;'/>");
                }

                manual.setContent(stringBuilder.toString());

                document.close();
            }

            CommonFile commonFile = commonFileService.upload(file, "MANUAL", Long.toString(id), 1);
            manual.setFileId(commonFile.getId());
            save(manual);

        } catch (Exception e) {
            e.printStackTrace();
            // ignore
        }
        return manual;
    }

    @Transactional
    public void uploadList(String manualGrpCd, InputStream inputStream) throws IOException, InvalidFormatException {
        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        List<Manual> manualList = new ArrayList<>();

        String level1Name = "";
        String level2Name = "";
        String level3Name = "";

        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
            Row row = sheet.getRow(rowIndex);
            String _level1Name = getString(row.getCell(0));
            String _level2Name = getString(row.getCell(1));
            String _level3Name = getString(row.getCell(2));
            String callKey = getString(row.getCell(3));

            if (!level1Name.equals(_level1Name) && isNotEmpty(_level1Name)) {
                level1Name = _level1Name;
                Manual manual = new Manual();
                manual.setLevel(0);
                manual.setManualNm(_level1Name);
                manual.setManualGrpCd(manualGrpCd);
                manual.setManualKey(callKey);

                manualList.add(manual);
            }

            if (!level2Name.equals(_level2Name) && isNotEmpty(_level2Name)) {
                level2Name = _level2Name;
                Manual parent = getParent(manualList, level1Name);

                if (parent != null) {
                    Manual manual = new Manual();
                    manual.setLevel(1);
                    manual.setManualNm(_level2Name);
                    manual.setManualGrpCd(manualGrpCd);
                    manual.setManualKey(callKey);

                    parent.addChildren(manual);
                }
            }

            if (!level3Name.equals(_level3Name) && isNotEmpty(_level3Name)) {
                level3Name = _level2Name;
                Manual parent = getParent(manualList, level2Name);

                if (parent != null) {
                    Manual manual = new Manual();
                    manual.setLevel(2);
                    manual.setManualNm(_level3Name);
                    manual.setManualGrpCd(manualGrpCd);
                    manual.setManualKey(callKey);

                    parent.addChildren(manual);
                }
            }
        }

        delete(qManual).where(qManual.manualGrpCd.eq(manualGrpCd)).execute();

        process(manualList);
    }

    public Manual getParent(List<Manual> manualList, String manualNm) {
        Manual parent = manualList.stream().filter(m -> m.getManualNm().equals(manualNm)).findAny().orElse(null);

        if (parent == null) {
            for (Manual _manual : manualList) {
                parent = getParent(_manual.getChildren(), manualNm);

                if (parent != null)
                    break;
            }
        }

        return parent;
    }

    public String getString(Cell cell) {
        if (cell == null) {
            return "";
        }

        switch (cell.getCellType()) {
            case Cell.CELL_TYPE_BLANK:
                return "";

            case Cell.CELL_TYPE_BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());

            case Cell.CELL_TYPE_ERROR:
                return "";

            case Cell.CELL_TYPE_STRING:
                return cell.getStringCellValue();

            case Cell.CELL_TYPE_NUMERIC:
                return Integer.toString((int) cell.getNumericCellValue());

            case Cell.CELL_TYPE_FORMULA:
                return cell.getCellFormula();
        }

        return "";
    }

    public Manual getManual(Long id) {
        Manual manual = findOne(id);

        if (manual.getFileId() != null) {
            manual.setFile(commonFileService.get("MANUAL", Long.toString(id)));
        }

        return manual;
    }
}
