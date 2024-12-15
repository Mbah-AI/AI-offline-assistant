package com.anonymous.MedicalChat;

import io.objectbox.annotation.Entity;
import io.objectbox.annotation.Id;

@Entity
public class MedicalData {

    @Id
    public long id;

    public String textData;

    public String textSource

    public MedicalData(String data, source) {
        this.textData = data;
        this.textSource = source
    }
}
