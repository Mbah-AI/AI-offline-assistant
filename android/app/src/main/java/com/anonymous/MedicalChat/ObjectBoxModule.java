package com.anonymous.MedicalChat;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Arguments;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.objectbox.Box;
import io.objectbox.BoxStore;

public class ObjectBoxModule extends ReactContextBaseJavaModule {

    private final BoxStore boxStore;

    public ObjectBoxModule(ReactApplicationContext reactContext) {
        super(reactContext);
        boxStore = MyApplication.getBoxStore();
    }

    @NonNull
    @Override
    public String getName() {
        return "ObjectBoxModule";
    }

    @ReactMethod
    public void insertEntity(String textData, String textSource, ReadableArray textDataEmbedding, Promise promise) {
        try {
            float[] embedding = new float[textDataEmbedding.size()];
            for (int i = 0; i < textDataEmbedding.size(); i++) {
                embedding[i] = (float) textDataEmbedding.getDouble(i); // Convert to float
            }
            MedicalData data = new MedicalData(0, textData, textSource, embedding);
            Box<MedicalData> medicalDataBox = boxStore.boxFor(MedicalData.class);
            long id = medicalDataBox.put(data);
            promise.resolve(id);
        } catch (Exception e) {
            // Reject the promise with an error if something goes wrong
            promise.reject("ERROR_INSERT", e);
        }
    }

    @ReactMethod
    public void getAllEntities(Promise promise) {
        try {
            Box<MedicalData> MedicalDataBox = boxStore.boxFor(MedicalData.class);
            List<MedicalData> entities = MedicalDataBox.getAll();
            List<Map<String, Object>> result = new ArrayList<>();

            for (MedicalData e : data) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", e.id);
                map.put("textData", e.textData);
                map.put("textSource", e.textSource)
                result.add(map);
            }
            promise.resolve(Arguments.makeNativeArray(result));
        } catch (Exception e) {
            promise.reject("ERROR_GETALL", e);
        }
    }

    @ReactMethod
    public void getMatchingEntities(ReadableArray queryEmbedding, Promise promise) {
        try {
            // Convert the JS float array (ReadableArray) to a Java float array
            float[] queryVector = new float[queryEmbedding.size()];
            for (int i = 0; i < queryEmbedding.size(); i++) {
                queryVector[i] = (float) queryEmbedding.getDouble(i);
            }

            Box<MedicalData> medicalDataBox = boxStore.boxFor(MedicalData.class);

            Query<MedicalData> query = medicalDataBox.query()
                    .vector(MedicalData_.textDataEmbedding)
                    .nearestNeighbor(queryVector, 5)
                    .build();

            List<MedicalData> matchingEntities = query.find();
            List<Map<String, Object>> result = new ArrayList<>();

            for (MedicalData e : matchingEntities) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", e.id);
                map.put("textData", e.textData);
                map.put("textSource", e.textSource);
                result.add(map);
            }
            promise.resolve(Arguments.makeNativeArray(result));
        } catch (Exception e) {
            promise.reject("ERROR_SEARCH", e);
        }
    }
}
