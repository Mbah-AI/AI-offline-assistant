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
    public void insertEntity(String textData, String textSource, Promise promise) {
        try {
            Box<MedicalData> MedicalDataBox = boxStore.boxFor(MedicalData.class);
            MedicalData data = new MedicalData(textData, textSource);
            long id = MedicalDataBox.put(data);
            promise.resolve(id);
        } catch (Exception e) {
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
    public void getMatchingEntities(String searchTerm, Promise promise) {
        try {
            Box<MedicalData> medicalDataBox = boxStore.boxFor(MedicalData.class);
            // Simple query that looks for the term within the textData
            Query<MedicalData> query = medicalDataBox.query()
                    .contains(MedicalData_.textData, searchTerm)
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
