package com.chequer.axboot.core.code;

import com.fasterxml.jackson.annotation.JsonValue;

public class Types {

    public enum UserStatus implements LabelEnum {
        ACCOUNT_LOCK("ACCOUNT_LOCK"), NORMAL("NORMAL");

        private final String label;

        UserStatus(String label) {
            this.label = label;
        }

        @Override
        @JsonValue
        public String getLabel() {
            return label;
        }
    }


    public static class FileExtensions {
        public static final String PNG = "PNG";
        public static final String JPG = "JPG";
        public static final String JPEG = "JPEG";
        public static final String GIF = "GIF";
        public static final String BMP = "BMP";
        public static final String TIFF = "TIFF";
        public static final String TIF = "TIF";
        public static final String PDF = "PDF";
    }

    public static class FileType {
        public static final String IMAGE = "IMAGE";
        public static final String PDF = "PDF";
        public static final String ETC = "ETC";
    }

    public static class ImagePreviewType {
        public static final String THUMBNAIL = "THUMBNAIL";
        public static final String ORIGIN = "ORIGIN";
    }
}
