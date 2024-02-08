<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    error_reporting(E_ALL);
    ini_set('display_errors', 'On');
    set_error_handler("var_dump");
    try {
        require_once("sanitize_input.php");
        $json_data = file_get_contents("php://input");
        $decoded_data = json_decode($json_data, true);
        $user_info = $decoded_data[0];
        $Comments = '';

        // Check if the decoded data is null
        if ($decoded_data === null) {
            throw new Exception("Error decoding JSON data");
        }

        // Check if the decoded data is an array and has at least one element
        if (!is_array($user_info) || count($user_info) === 0) {
            throw new Exception("No valid array found in the JSON data");
        }

        // Assign values to PHP variables
        $Nome = sanitize_input($user_info['Nome']);
        $Email = sanitize_input($user_info['Email']);
        $dddCel = sanitize_input($user_info['dddCel']);
        $Telefone = sanitize_input($user_info['Telefone']);
        $dddTelefone = sanitize_input($user_info['dddTelefone']);
        $Telefone2 = sanitize_input($user_info['Telefone2']);

        if (isset($user_info['Comments'])) {
            $Comments = sanitize_input($user_info['Comments']);
        }



        // Set email headers

        $to = "marildablueberry@uol.com.br";
        $subject = "Novo Pedido da BlueBerryCamisetas";
        $from = "orcamento@blueberrycamisetas.com.br";



        $htmlContentHeader = "<html>
    <head>
        <style>
            table {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            th {
                background-color: #3F84C5;
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: center;
                background-color: #3F84C5;
                color: white;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }

        </style>
    </head>
    <body>
        ";

        $userInfoTable =
        "<table>
            <tr>
                <th colspan=2>Informações do Cliente</th>
            </tr>
            <tr>
                <td>Nome</td>
                <td>$Nome</td>
            </tr>
            <tr>
                <td>E-mail</td>
                <td>$Email</td>
            </tr>
            <tr>
                <td>Telefone</td>
                <td>$dddCel $Telefone</td>
            </tr>
            <tr>
                <td>Telefone Secundário</td>
                <td>$dddTelefone $Telefone2</td>
            </tr>
            <tr>
                <td>Comentários</td>
                <td style='max-width: 50vw; word-wrap: break-word;'>$Comments</td>
            </tr>
        </table>
        <br><br>
        ";

        $htmlContent = $htmlContentHeader . $userInfoTable;

        array_shift($decoded_data);
        $tableHolder =
        "<div style='white-space: nowrap;'>";
        $tablesPerRow = 3; // Number of tables per row
        $tableCounter = 0;
        // Iterate over the remaining objects
        foreach ($decoded_data as $index => $object) {
            $product_type = $object["productType"];
            $emailTable = "
            <table style='display: inline-block; vertical-align: top; margin-right: 20px;'>";
            $tableHeader = "
                <tr><th colspan=2 style='text-align: center; background:#927191'> Produto: " . ucfirst($product_type) . "</th></tr>";
            $objectTable = "";

            // Iterate over $object array to create table rows
            foreach ($object as $key => $value) {
                if ($key == "productType") {
                    continue;
                }
                $tableRow = "
                <tr><td>" . $key . "</td><td>" . $value. "</td></tr>";
                $objectTable .= $tableRow;
            }

            $emailTable = $emailTable . $tableHeader .  $objectTable . "
            </table>";
            $tableHolder .= $emailTable;
            $tableCounter++;

            if ($tableCounter % $tablesPerRow == 0) {
                // Add a line break after every $tablesPerRow tables
                $tableHolder .= "<br><br>";
            }
        }
        $tableHolder .= "
        </div>";
        $htmlContent .= $tableHolder;
        // HTML content
        $htmlContent .= "
    </body>
</html>
        ";
        $filePath = "html/test.html";
        file_put_contents($filePath, $htmlContent);


        // Send JSON-encoded response to the client
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type: text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: " . $from;



        mail($to, $subject, $htmlContent, $headers);

        header("Content-Type: application/json");
        $response = array('status' => 'success', 'message' => 'Orçamento submetido com sucesso! Por favor, aguarde nosso contato.');
        echo json_encode($response);
    } catch (Exception $e) {
        // Handle exceptions and send an error response
        header("Content-Type: application/json");
        $response = array('status' => 'error', 'message' => 'Erro');
        echo json_encode($response);
    }
}
?>
