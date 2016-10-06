package com.chequer.axboot.core.test;

import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.junit.Test;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class DocumentJTest {

    @Test
    public void test() throws Docx4JException, FileNotFoundException {

        Docx4jProperties.getProperties().setProperty("docx4j.Log4j.Configurator.disabled", "true");

        String inputfilepath = "/Users/brant/Downloads/a.docx";

        WordprocessingMLPackage wordMLPackage;

        System.out.println("Loading file from " + inputfilepath);
        wordMLPackage = Docx4J.load(new java.io.File(inputfilepath));

        HTMLSettings htmlSettings = Docx4J.createHTMLSettings();

        htmlSettings.setImageDirPath(inputfilepath + "_files");
        htmlSettings.setImageTargetUri(inputfilepath.substring(inputfilepath.lastIndexOf("/") + 1) + "_files");
        htmlSettings.setWmlPackage(wordMLPackage);

        //SdtWriter.registerTagHandler("HTML_ELEMENT", new SdtToListSdtTagHandler());

        OutputStream os;
        os = new FileOutputStream(inputfilepath + ".html");

        // If you want XHTML output
        //Docx4jProperties.setProperty("docx4j.Convert.Out.HTML.OutputMethodXML", true);

        //Docx4J.toPDF(wordMLPackage, os);

        Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_NONE);

        if (wordMLPackage.getMainDocumentPart().getFontTablePart() != null) {
            wordMLPackage.getMainDocumentPart().getFontTablePart().deleteEmbeddedFontTempFiles();
        }
    }
}
