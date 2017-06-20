package com.example.thijs.videoapp;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

/**
 * Created by Bram on 19-6-2017.
 */

public class IdActivity extends AppCompatActivity
{
    private static final String ID_URL = "https://videoland.herokuapp.com/api/films/5";

    private TextView mainText;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_id);
        mainText = (TextView) findViewById(R.id.responseField);

        StringRequest stringRequest = new StringRequest(Request.Method.GET, ID_URL,
                new Response.Listener<String>()
                {
                    @Override
                    public void onResponse(String response)
                    {
                        mainText.setText(response);
                        displayMessage("JSON opgehaald.");
                    }
                },

                // Error handling.
                new Response.ErrorListener()
                {
                    @Override
                    public void onErrorResponse(VolleyError error)
                    {
                        displayMessage(error.toString());
                    }
                })

            {
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }

    // Makkelijker om berichten te weergeven in-app.
    public void displayMessage(String toastString)
    {
        Toast.makeText(getApplicationContext(), toastString, Toast.LENGTH_LONG).show();
    }
}
