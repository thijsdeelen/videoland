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

// 'Login'.
public class LoginActivity extends AppCompatActivity
{
    // Login en registeren links van de webserver.
    private static final String REGISTER_URL = "https://videoland.herokuapp.com/api/register";
    private static final String LOGIN_URL = "https://videoland.herokuapp.com/api/login";

    // Deze keywords worden gebruikt voor de HASHMAP.
    public static final String KEY_USERNAME = "username";
    public static final String KEY_PASSWORD = "password";

    // Token alvast declareren.
    public String token;

    // UI dingen.
    private EditText editTextUsername;
    private EditText editTextPassword;

    private Button buttonRegister;
    private Button buttonLogin;
    private Button buttonToken;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // UI items instellen.
        editTextUsername = (EditText) findViewById(R.id.editTextUsername);
        editTextPassword = (EditText) findViewById(R.id.editTextPassword);

        buttonRegister = (Button) findViewById(R.id.buttonRegister);
        buttonLogin = (Button) findViewById(R.id.buttonLogin);
        buttonToken = (Button) findViewById(R.id.buttonToken);



        // Registreren.
        buttonRegister.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // Krijgt wederom teksten mee uit de velden.
                registerUser(editTextUsername.getText().toString().trim(), editTextPassword.getText().toString().trim());
            }
        });

        // Login.
        buttonLogin.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // Krijgt de teksten mee uit de velden.
                handleLogin(editTextUsername.getText().toString(), editTextPassword.getText().toString());
            }
        });

        // Token weergeven.
        buttonToken.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                // Shared preferences openenen
                Context context = getApplicationContext();
                SharedPreferences sharedPref = context.getSharedPreferences("com.example.thijs.videoapp.SHARED_PREFS_FILE", Context.MODE_PRIVATE);

                // De opgeslagen token van de user, opgehaald uit de shared preferences.
                final String savedtoken = sharedPref.getString("saved_token", "Geen token aanwezig.");

                if (savedtoken != null)
                {
                    displayMessage(savedtoken);
                }

                else
                {
                    displayMessage("Token is niet ingesteld. Log in.");
                }
            }
        });
    }

    private void registerUser(String newUsername, String newPassword)
    {
        // Deze moeten final zijn.
        final String username = newUsername;
        final String password = newPassword;

        StringRequest stringRequest = new StringRequest(Request.Method.POST, REGISTER_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response)
                    {
                        displayMessage(response);
                    }
                },

                // Error handling.
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        handleErrorResponse(error);
                    }
                })

                {
                    @Override
                    protected Map<String, String> getParams()
                    {
                        Map<String, String> params = new HashMap<String, String>();
                        params.put(KEY_USERNAME, username);
                        params.put(KEY_PASSWORD, password);
                        return params;
                    }
                };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    private void handleLogin(String newUsername, String newPassword)
    {
        // Deze moeten final zijn.
        final String username = newUsername;
        final String password = newPassword;

        StringRequest stringRequest = new StringRequest(Request.Method.POST, LOGIN_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response)
                    {
                        try
                        {
                            // Van String naar JSON naar String.
                            JSONObject newToken = new JSONObject(response);
                            token = newToken.getString("token");

                            displayMessage("Succesvol ingelogd");

                            Context context = getApplicationContext();
                            SharedPreferences sharedPref = context.getSharedPreferences(
                                    "com.example.thijs.videoapp.SHARED_PREFS_FILE", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putString("saved_token", token);
                            editor.commit();

                            // Bevestig dat token is opgeslagen
                            displayMessage("token is opgeslagen");




                            Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                            startActivity(intent);
                            finish();
                            //}

                        }

                        // Exception.
                        catch (JSONException e)
                        {
                            e.printStackTrace();
                            displayMessage(e.toString());
                        }
                    }
                },

                // Error handling.
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        handleErrorResponse(error);
                    }
                })
            {
                @Override
                protected Map<String, String> getParams()
                {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put(KEY_USERNAME, username);
                    params.put(KEY_PASSWORD, password);
                    return params;
                }
            };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    // Handel Volley errors op de juiste manier af.
    public void handleErrorResponse(VolleyError error)
    {
        Log.e("MAIN", "handleErrorResponse");

        if(error instanceof com.android.volley.AuthFailureError)
        {
            String json = null;
            NetworkResponse response = error.networkResponse;
            if(response != null && response.data != null)
            {
                json = new String(response.data);
                json = trimMessage(json, "error");
                if (json != null)
                {
                    json = "Error " + response.statusCode + ": " + json;
                    displayMessage(json);
                }
            }

            else
            {
                Log.e("Main", "handleErrorResponse: kon geen networkResponse vinden.");
            }
        }

        else if(error instanceof com.android.volley.NoConnectionError)
        {
            Log.e("MAIN", "handleErrorResponse: server was niet bereikbaar");
        }

        else
        {
            Log.e("MAIN", "handleErrorResponse: error = " + error);
        }
    }

    // Message trimming.
    public String trimMessage(String json, String key)
    {
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

    // Makkelijker om berichten te weergeven in-app.
    public void displayMessage(String toastString)
    {
        Toast.makeText(getApplicationContext(), toastString, Toast.LENGTH_LONG).show();
    }
}
