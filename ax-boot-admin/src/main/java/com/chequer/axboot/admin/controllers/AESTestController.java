package com.chequer.axboot.admin.controllers;

import com.chequer.axboot.core.controllers.BaseController;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.springframework.web.bind.annotation.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@RestController
public class AESTestController extends BaseController {


    AES256Util aes256Util;

    public AESTestController() throws UnsupportedEncodingException {
        aes256Util = new AES256Util("l25232trf6104z3439q8zo6zix8k6s39");
    }

    @RequestMapping(value = "/api/v1/aes/enc", method = RequestMethod.POST)
    public String enc(HttpServletRequest request) throws NoSuchPaddingException, InvalidAlgorithmParameterException, IOException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        String data = IOUtils.toString(request.getInputStream(), "UTF-8");
        return encode(aes256Util.aesEncode(data));
    }

    @RequestMapping(value = "/api/v1/aes/dec", method = RequestMethod.POST)
    public String dec(HttpServletRequest request) throws NoSuchPaddingException, InvalidAlgorithmParameterException, IOException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        String data = IOUtils.toString(request.getInputStream(), "UTF-8");
        return aes256Util.aesDecode(decode(data));
    }

    public String decode(String data) throws UnsupportedEncodingException {
        byte[] byteStr = Base64.decodeBase64(data.getBytes());
        return new String(byteStr, "UTF-8");
    }

    public String encode(String data) throws UnsupportedEncodingException {
        byte[] byteStr = Base64.encodeBase64(data.getBytes());
        return new String(byteStr, "UTF-8");
    }

    public static void main(String[] args) throws UnsupportedEncodingException, NoSuchPaddingException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        AES256Util aes256Util = new AES256Util("l25232trf6104z3439q8zo6zix8k6s39");
        System.out.println(aes256Util.aesDecode(new String(Base64.decodeBase64("bndLRk93dE8xdmNQQThBM1gzc3ZXRndscjArM0E3V3loZGk2Um12U1Nqb1piOW1YNE4wNnMreFF0K2NBdjVQOVdMaXN0a1BxZlNWVnl3T3VkdXhTK1E9PQ=="), "UTF-8")));
    }
}
