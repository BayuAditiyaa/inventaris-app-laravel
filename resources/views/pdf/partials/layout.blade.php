<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Breeze Inventory Report' }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #0f172a;
            font-size: 12px;
            line-height: 1.45;
        }
        .header {
            border-bottom: 2px solid #cbd5e1;
            margin-bottom: 20px;
            padding-bottom: 12px;
        }
        .title {
            font-size: 22px;
            font-weight: 700;
            margin: 0;
        }
        .subtitle {
            color: #475569;
            margin-top: 6px;
        }
        .meta {
            color: #64748b;
            font-size: 11px;
            margin-top: 4px;
        }
        .cards {
            margin: 16px 0 20px;
        }
        .card {
            display: inline-block;
            vertical-align: top;
            width: 23%;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 10px 12px;
            margin-right: 1%;
            box-sizing: border-box;
        }
        .card-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 6px;
        }
        .card-value {
            font-size: 18px;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background: #e2e8f0;
            color: #1e293b;
            text-align: left;
            padding: 10px;
            font-size: 11px;
        }
        td {
            border-bottom: 1px solid #e2e8f0;
            padding: 9px 10px;
            vertical-align: top;
        }
        .text-right {
            text-align: right;
        }
        .muted {
            color: #64748b;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 700;
            background: #e2e8f0;
            color: #334155;
        }
        .footer {
            margin-top: 22px;
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    {{ $slot }}
</body>
</html>
