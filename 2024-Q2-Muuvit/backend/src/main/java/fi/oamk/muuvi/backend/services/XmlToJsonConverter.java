package fi.oamk.muuvi.backend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import java.io.IOException;

public class XmlToJsonConverter {

    public JsonNode convert(String xmlString) {
        ObjectMapper xmlMapper = new XmlMapper();
        try {
            return xmlMapper.readTree(xmlString.getBytes());
        } catch (IOException e) {
            System.out.println(e);
            return null;
        }
    }
}
