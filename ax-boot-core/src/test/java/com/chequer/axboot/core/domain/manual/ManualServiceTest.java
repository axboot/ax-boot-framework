package com.chequer.axboot.core.domain.manual;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.junit.Test;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ManualServiceTest {

    /*
    @Inject
    private ManualService manualService;
*/
    @Test
    public void test() throws IOException, InvalidFormatException {
        //manualService.uploadList("M01", new FileInputStream(new File("/Users/brant/Downloads/manual.xlsx")));
    }

    @Test
    public void pdfToImage() throws IOException {
        PDDocument document = PDDocument.load(new File("/Users/brant/Downloads/test.pdf"));

        /*
        PDDocumentCatalog docCatalog = document.getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();

        PDResources res = acroForm.getDefaultResources();
        if (res == null)
            res = new PDResources();

        InputStream fontStream = getClass().getResourceAsStream("LiberationSans-Regular.ttf");
        PDTrueTypeFont font = PDTrueTypeFont.load(document, fontStream, Encoding.);
        String fontName = res.addFont(font);
        acroForm.setDefaultResources(res);
        */

        PDFRenderer pdfRenderer = new PDFRenderer(document);
        for (int page = 0; page < document.getNumberOfPages(); ++page) {
            BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 600, ImageType.RGB);
            ImageIO.write(bim, "jpg", new File("/Users/brant/Downloads/" + (page + 1) + ".jpg"));
        }
        document.close();
    }

}