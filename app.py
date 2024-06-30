import dash
import dash_html_components as html

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout of the app
app.layout = html.Div(
    children=[
        html.H1("Sales Analysis Dashboard", style={"textAlign": "center"}),
        html.P("This dashboard provides insights into sales data for XYZAutomotives."),
    ]
)

# Run the app
if __name__ == "__main__":
    app.run_server(debug=True)
