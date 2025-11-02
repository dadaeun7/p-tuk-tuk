package com.server.back.infrastructure.ocr.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OcrService {

    private final ImageAnnotatorClient visionClient;

    public List<String> detecTextFromJpg(byte[] imageBytes) throws IOException {

        try {

            ByteString imgBytes = ByteString.copyFrom(imageBytes);
            Image img = Image.newBuilder().setContent(imgBytes).build();

            Feature feature = Feature.newBuilder().setType(Feature.Type.DOCUMENT_TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feature).setImage(img).build();

            BatchAnnotateImagesResponse response = visionClient.batchAnnotateImages(Collections.singletonList(request));

            List<String> extractedList = new ArrayList<>();

            for (AnnotateImageResponse res : response.getResponsesList()) {
                if (res.hasError()) {
                    log.error("Vision API 에러 발생: " + res.getError().getMessage());
                    throw new IOException("Vision API 에러 발생으로 실패로 처리되었습니다.");
                }

                if (res.getFullTextAnnotation() != null) {
                    String fullText = res.getFullTextAnnotation().getText();
                    extractedList.addAll(Arrays.asList(fullText.split("\n")));
                }
            }

            return extractedList;

        } catch (IOException e) {
            log.error("jpg 변환 중 오류가 발생했습니다. " + e.getMessage());
            throw new IOException("Vision API 에서 Client 및 image 처리 중 에러가 발생했습니다. " + e.getMessage());
        } finally {
            if (visionClient != null) {
                visionClient.close();
            }
        }
    }
}
