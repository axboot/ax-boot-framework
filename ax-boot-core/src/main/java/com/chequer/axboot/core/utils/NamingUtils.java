package com.chequer.axboot.core.utils;

public class NamingUtils {

	public static final String CONTROLLER = "Controller";

	public static final String SERVICE = "Service";

	public static final String VO = "VO";

	public static final String REPOSITORY = "Repository";

	public static final String ENTITY = "Entity";

	public static String className(String underScore) {
		String name = fieldName(underScore);
		return Character.toUpperCase(name.charAt(0)) + name.substring(1);
	}

	public static String classNameWithType(String className, String type) {
		return className + type;
	}

	public static String classFieldName(String className) {
		return classFieldNameWithType(className, "");
	}

	public static String classFieldNameWithType(String className, String type) {
		if (className.length() == 1) {
			return Character.toLowerCase(className.charAt(0)) + type;
		}

		StringBuilder sb = new StringBuilder();

		int firstLowerCaseIndex = 0;

		for (int i = 0; i < className.length(); i++) {
			if (Character.isLowerCase(className.charAt(i))) {
				firstLowerCaseIndex = i;
				break;
			}
		}

		for (int i = 0; i < firstLowerCaseIndex - 1; i++) {
			sb.append(Character.toLowerCase(className.charAt(i)));
		}

		if (firstLowerCaseIndex > 1) {
			sb.append(Character.toUpperCase(className.charAt(firstLowerCaseIndex - 1)));
		} else {
			sb.append(Character.toLowerCase(className.charAt(0)));
		}

		sb.append(className.substring(firstLowerCaseIndex));
		sb.append(type);

		return sb.toString();
	}

	public static String fieldName(String underScore) {
		StringBuilder name = new StringBuilder();

		underScore = underScore.toLowerCase();

		boolean isUnderScore = false;

		for (int i = 0; i < underScore.length(); i++) {
			char spell = underScore.charAt(i);

			if (isUnderScore) {
				name.append(Character.toUpperCase(spell));
				isUnderScore = false;
			} else {
				if (spell == '_') {
					isUnderScore = true;
				} else {
					name.append(spell);
				}
			}
		}
		return name.toString();
	}

	public static String classFileNameWithType(String className, String type) {
		return className + type + ".java";
	}

	public static String classFileNameWithTypeAndExt(String className, String type, String ext) {
		return className + type + "." + ext;
	}

	public static String xmlFileNameWithType(String className, String type) {
		return className + type + ".xml";
	}

	public static String classFileName(String className) {
		return classFileNameWithType(className, "");
	}
}
