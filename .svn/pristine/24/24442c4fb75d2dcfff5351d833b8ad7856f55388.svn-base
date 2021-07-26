let publicKey = 'MIIBOjANBgkqhkiG9w0BAQEFAAOCAScAMIIBIgKCARkAnz+zpnbVvjFu8Sv/2/nhfOx/akIZ5ZfJ7qUKQfKiU02zW8EWOWoeQxMaFMU/QBA6DI2gDAAjx/fBCbchJBQHiw7Bn8C6CiXf4WWV71KPACIE5pLmleZTVrpO5pp/6pGm0jnbXteylNVYNQof/oozbHyKKXAMyiZIuRpJlyweU1u6VDNd0LlsWgaePEPb3jWkFIGByf3fh6Y2PYOPsLShLhbLRU0l8UbOqvgFvL6ARYnJdjVTEDUPJ8dAa/i12uogeoAJ0takC6zkHAtT8sJfK0U8db5eGDOYc2RRHXEluYJHe2PiWBihfqr760e6SArzw6M1e1PLMOvcKp5fJG4fkGv7tnpVjTUzX3eJdF7GoyFNuTWx2mhHbQIDAQAB'
let privateKey = 'MIIFKQIBADANBgkqhkiG9w0BAQEFAASCBRMwggUPAgEAAoIBGQCMucS9Z6qi0l1ii6IvmH+Nm4XmK1nAjsJFws/HqD69Xd/2/4n1zfEOk63lYhUjkM/Wdz1J+OI4nFTjeTA6XDCpb1F+P3+/zm7D2JV5c8y4k5pu9ad6qxZs5Eg0D9tauNgUEUwXBwFDi/4f0FAB4C0ZKJfZknhXm1cfvorVnAfBrdhcgsUAy3zsx/h2HTmNLQYuNXKm2sCK8A+1ZeteqciMfn5UzEpeGMm55xiWvrV8NKnM2ZaWf2vMks/NPJdwPouJnTy5P63W3T5tsAuVcXTdfrwLTaTQ4UmEnDWvtDbPLSUkmPJeaVOE2hswKOgCveyuASInEIa9nt+o514pn5bqmW2DkLAsuUdNCq15+xXrBDGyfUXiUvBFAgMBAAECggEYFy4GTRiFT9qMzU2owmRBJmcmsBoV55TcRTdomD+LTg/nczz2UYnBmiATNcRpLPmOcooji0q2oJKHnQx6ODK1RUNzzfLRrRtovVOwk1fSsdiGSJ6oHpmN0RPtHL476H6oAO40dVqPB7xIeJ8MfrKZWxqHoKvyrKOGv1DYd4UC9hEXoW1c29uo0SvDLlk1Lks3Z18ukrhly1tbX0nDWZK0gvDbyANhz24Ky2ObHolmDmxFXF0lYBhCPoPK25ic6bpP065IOThl83+qKyfRKaY4BmD9k14ePK+gyZ/XBBNUpxroefAnAeBE/uEEAXYdk9pRE+3G5T2XuHarSicc7osTc6/voj04JHaHoeAvlc0CgjLjZfHHiH11ZQKBjQDRFiLAPYi0c5k9suHgOzumzbwPoRiHEBU2MN0KyFfVInPjagVqsEB6F+XFD+lWunn7x1HwMkZGD564oRtkm1CBZhwWF+R3YIBkelGJUwHZgCd/RN1fj/NwYkwArLRyCXsc1n/banVS/xkYoTenEggzPUEFsSLwBhSO1ff5T/eS5VwzmiWUkKnYnWyKlwKBjQCsTQIfXbmGyATQIszt1+fySrtZsJO959g2YLKfTEhSIVmIiTl5AgaPjW44wO4F8/elTbxnyR7DEj5A1qujWnjcCXO7k7Tgjxw7B9sOrvGjf2+sQ/XnMCD3ukCXI5tiFzC4syhk1B1Bab1ObULTKnZe18jtgQA3q4TA2fPWn3oiGTIAqm43O+55VWHDgwKBjDYclXfNNREGjdVC82Q10DVWL2KYHaHuzp6MvNgqi1i0putnJ+m5naY7gxKiEJCKiEFaD2GrkTZWmoxL3awG6injBEfPfShMCE54vZtdqS/iE9bDOsudlLI0LllKWRTeUUdgWAywG5cUQCl4p8+MQiUIqEhR1Knr2Owygg+622bgByGvtiQh4GMYMtwXAoGMWCeybU/ry2ztIXycsxgjYVEhGBuDC8fiVLgWy/AglHzhrTzgfewuZSYsfbcgUUVosFfcjJFXPuFHnq729EYmzhW78/33rmkqPX2gc5vIoClkfpPq7ZUvWPAfefTK3F4XHHj1stjf+wbZx5WZeicglxf6gqHc9Z649l7NJkNEHswbTEHm0DXGpqertHcCgY0AqxkcrImCFC3y0aM60uhuJmzgMv/zpxzfoJWqiQs8+ZQKeG2Ib5HnqpubwY4NDDo8qNFthfres1aXjcHSvROfpwHsGKv2h++rIuk2mft43NzJYgLlgxfuTRPT8Y3J4I1CGW+W/UYuUgpFNXjD/EWjU1H0YLPCt6lzQwMy+9uIy26eMocrbFEY2qW4e0M='
import JSEncrypt from 'jsencrypt'
export default {
    //加密方法
    RSAencrypt(pas){
        //实例化jsEncrypt对象
        let jse = new JSEncrypt();
        //设置公钥
        jse.setPublicKey(publicKey);
        // console.log('加密：'+jse.encrypt(pas))
        return jse.encrypt(pas);
    },
    
    //解密方法
    RSAdecrypt(pas){
        let jse = new JSEncrypt();
        // 私钥
        jse.setPrivateKey(privateKey)
        // console.log('解密：'+jse.decrypt(pas))
				// console.log('解密：'+jse.decrypt(pas.toString()))
        return jse.decrypt(pas);
    },


}
