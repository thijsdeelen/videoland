package com.example.thijs.videoapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private static final String REGISTER_URL = "https://videoland.herokuapp.com/api/register";
    private static final String LOGIN_URL = "https://videoland.herokuapp.com/api/login";

    public static final String KEY_USERNAME = "username";
    public static final String KEY_PASSWORD = "password";

    private EditText editTextUsername;
    private EditText editTextPassword;

    private String mUsername;
    private String mPassword;

    private Button buttonRegister;
    private Button buttonLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        editTextUsername = (EditText) findViewById(R.id.editTextUsername);
        editTextPassword = (EditText) findViewById(R.id.editTextPassword);

        buttonRegister = (Button) findViewById(R.id.buttonRegister);
        buttonLogin = (Button) findViewById(R.id.buttonLogin);

        buttonLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mUsername = editTextUsername.getText().toString();
                mPassword = editTextPassword.getText().toString();

                handleLogin(mUsername, mPassword);
            }
            });

        buttonRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                registerUser();
            }
        });
        }

    private void registerUser(){
        final String username = editTextUsername.getText().toString().trim();
        final String password = editTextPassword.getText().toString().trim();

        StringRequest stringRequest = new StringRequest(Request.Method.POST, REGISTER_URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Toast.makeText(MainActivity.this,response, Toast.LENGTH_LONG).show();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(MainActivity.this,error.toString(),Toast.LENGTH_LONG).show();
                    }
                }){
                @Override
                protected Map<String, String> getParams(){
                    Map<String, String> params = new HashMap<String, String>();
                    params.put(KEY_USERNAME, username);
                    params.put(KEY_PASSWORD, password);
                    return params;
                }
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    private void handleLogin(String username, String password){

        String body = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";
        Log.i("MainActivity", "handleLogin - body =" + body);

        try {
            displayMessage("ik ben in de try");
            JSONObject jsonBody = new JSONObject(body);
            JsonObjectRequest jsObjectRequest = new JsonObjectRequest(Request.Method.POST, LOGIN_URL, jsonBody, new Response.Listener<JSONObject>(){

                @Override
                public void onResponse(JSONObject response) {
                        displayMessage("Succesvol ingelogd.");
                    try {
                        displayMessage("Succesvol ingelogd.");
                        String token = response.getString("token");

                        Context context = getApplicationContext();
                        SharedPreferences sharedPref = context.getSharedPreferences(
                                "LINK NAAR FILE", Context.MODE_PRIVATE);
                        SharedPreferences.Editor editor = sharedPref.edit();
                        editor.putString("saved_token", token);
                        editor.commit();

                        //todo
                        // Open nieuwe activity

                    } catch (JSONException e){
                        Log.e("MAIN", e.getMessage());
                    }
                }
            }, new Response.ErrorListener() {

                @Override
                public void onErrorResponse(VolleyError error) {
                    handleErrorResponse(error);
                }
            });

        jsObjectRequest.setRetryPolicy(new DefaultRetryPolicy(
                1500,
                2,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        } catch (JSONException e) {
            Log.e("Main", e.getMessage());
        }
        return;
    }

    // Handel Volley errors op de juuiste manier af.

    public void handleErrorResponse(VolleyError error) {
        Log.e("MAIN", "handleErrorResponse");

        if(error instanceof com.android.volley.AuthFailureError) {
            String json = null;
            NetworkResponse response = error.networkResponse;
            if(response != null && response.data != null) {
                json = new String(response.data);
                json = trimMessage(json, "error");
                if (json != null) {
                    json = "Error " + response.statusCode + ": " + json;
                    displayMessage(json);
                }
            } else {
                Log.e("Main", "handleErrorResponse: kon geen networkResponse vinden.");
            }
        } else if(error instanceof com.android.volley.NoConnectionError) {
            Log.e("MAIN", "handleErrorResponse: server was niet bereikbaar");
        } else {
            Log.e("MAIN", "handleErrorResponse: error = " + error);
        }
    }


    public String trimMessage(String json, String key){
        Log.i("MAIN", "trimMessage: json = " + json);
        String trimmedString = null;

        try{
            JSONObject obj = new JSONObject(json);
            trimmedString = obj.getString(key);
        } catch (JSONException e){
            e.printStackTrace();
            return null;
        }
        return trimmedString;
    }

    public void displayMessage(String toastString) {
        Toast.makeText(getApplicationContext(), toastString, Toast.LENGTH_LONG).show();
    }
}
