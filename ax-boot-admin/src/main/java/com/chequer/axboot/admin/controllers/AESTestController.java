package com.chequer.axboot.admin.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@RestController
public class AESTestController {


    AES256Util aes256Util;

    public AESTestController() throws UnsupportedEncodingException {
        aes256Util = new AES256Util("l25232trf6104z3439q8zo6zix8k6s39");
    }

    @RequestMapping(value = "/api/v1/aes/enc", method = RequestMethod.GET)
    public String enc(@RequestParam String data) throws NoSuchPaddingException, InvalidAlgorithmParameterException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        return aes256Util.aesEncode(data);
    }

    @RequestMapping(value = "/api/v1/aes/dec", method = RequestMethod.GET)
    public String dec(@RequestParam String data) throws NoSuchPaddingException, InvalidAlgorithmParameterException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException, NoSuchAlgorithmException, InvalidKeyException {
        return aes256Util.aesDecode(data);
    }

    public static void main(String[] args) throws UnsupportedEncodingException, NoSuchPaddingException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        AES256Util aes256Util = new AES256Util("l25232trf6104z3439q8zo6zix8k6s39");
        System.out.println(aes256Util.aesDecode("bndLRk93dE8xdmNQQThBM1gzc3ZXRndscjArM0E3V3loZGk2Um12U1Nqb1piOW1YNE4wNnMreFF0K2NBdjVQOVdMaXN0a1BxZlNWVnl3T3VkdXhTK1E9PQ=="));
    }
}
