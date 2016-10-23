package com.chequer.axboot.admin.domain.manual;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.tools.imageio.ImageIOUtil;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.junit.Test;

import javax.imageio.ImageIO;
import java.awt.*;
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
        System.setProperty("sun.java2d.cmm", "sun.java2d.cmm.kcms.KcmsServiceProvider");

        PDDocument document = PDDocument.load(new File("/Users/brant/Downloads/test.pdf"));

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

        for (int page = 0; page < document.getNumberOfPages(); ++page) {
            String file = "/Users/brant/Downloads/" + (page) + ".jpg";

            BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 720, ImageType.RGB);

            ImageIOUtil.writeImage(bim, file, 720);

            BufferedImage read = ImageIO.read(new File(file));

            int width = 2048;
            int height = (read.getHeight() * width) / read.getWidth();

            BufferedImage outputImage = new BufferedImage(width, height, bim.getType());

            Graphics2D g2d = outputImage.createGraphics();
            g2d.drawImage(read, 0, 0, width, height, null);
            g2d.dispose();

            ImageIOUtil.writeImage(outputImage, file, 720);
        }

        document.close();
    }
}