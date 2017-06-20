package com.example.thijs.videoapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {


    private Button buttonLogout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //Is er een token aanwezig?
        if(tokenAvailable()) {
            setContentView(R.layout.activity_main);

            buttonLogout = (Button) findViewById(R.id.buttonLogout);

            // Registreren.
            buttonLogout.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                   deleteToken();

                    Intent logIn = new Intent(getApplicationContext(), LoginActivity.class);
                    startActivity(logIn);
                    finish();
                }
            });
        } else {
            Intent logIn = new Intent(getApplicationContext(), LoginActivity.class);
            startActivity(logIn);
            finish();
        }
    }

    //Check of er een token is opgeslagen in shared prefs.
    private boolean tokenAvailable() {
        boolean result = false;

        Context context = getApplicationContext();
        SharedPreferences sharedPref = context.getSharedPreferences("com.example.thijs.videoapp.SHARED_PREFS_FILE", Context.MODE_PRIVATE);

        String savedtoken = sharedPref.getString("saved_token", "Geen token aanwezig.");

        if(savedtoken != null && !savedtoken.equals("Geen token aanwezig.")) {
            result = true;
        }
        return result;
    }

    private void deleteToken() {

        Context context = getApplicationContext();
        SharedPreferences sharedPref = context.getSharedPreferences("com.example.thijs.videoapp.SHARED_PREFS_FILE", Context.MODE_PRIVATE);

        sharedPref.edit().remove("saved_token").commit();
    }
}
