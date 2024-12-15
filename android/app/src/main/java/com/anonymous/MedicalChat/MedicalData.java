package com.anonymous.MedicalChat;

import io.objectbox.annotation.Entity;
import io.objectbox.annotation.Id;

@Entity
public class MedicalData {

    @Id
    public long id;

    @Index
    public String textData;

    @Vector
    public float[] textDataEmbedding;

    public String textSource

    public MedicalData(long id, String textData, String textSource, float[] textDataEmbedding) {
        this.id = id;
        this.textData = textData;
        this.textSource = textSource;
        this.textDataEmbedding = textDataEmbedding;
    }

    // No-argument constructor required by ObjectBox
    public MedicalData() {
    }
}
