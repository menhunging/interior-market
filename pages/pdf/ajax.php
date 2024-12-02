<?php

namespace InteriorMarket\Helpers\Hlblock;

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) {
    die();
}

use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Type\DateTime;
use Bitrix\Main\ArgumentException;
use Dompdf\Dompdf;

class CompilationListAjaxController extends Controller
{
    const COLLECTION = 'CollectionsLk';
    const COLLECTION_PRODUCTS = 'CollectionsProductsLk';

    public function configureActions()
    {
        return [
            'selectionAddNew' => [
                'prefilters' => []
            ],
            'delSelection' => [
                'prefilters' => []
            ]
        ];
    }

    public function selectionAddNewAction($data)
    {
        $dt = new DateTime();
        $data = array(
            "UF_NAME" => (string)$data[0]['value'],
            "UF_UPDATE" => $dt,
            "UF_CREATE" => $dt,
            "UF_USER_ID" => (string)$data[1]['value']
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->addElement($data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function delSelectionAction($id)
    {
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->deleteElement($id);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function selectionUpdateAction($data)
    {
        $dt = new DateTime();
        $id = (int)$data[5]['value'];
        $data = array(
            "UF_NAME" => (string)$data[0]['value'],
            "UF_UPDATE" => $dt,
            "UF_CLIENT_NAME" => (string)$data[1]['value'],
            "UF_CLIENT_PHONE" => (string)$data[2]['value'],
            "UF_CLIENT_EMAIL" => (string)$data[3]['value'],
            "UF_COMMENT" => (string)$data[3]['value'],
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->updateElement($id, $data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function genUrlSelectionAction($id, $name)
    {
        $data = array(
            "UF_CODE" => md5($name),
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->updateElement($id, $data);

            $item = $hlblock->getList([
                'select' => [
                    'ID',
                    'CODE' => 'UF_CODE',
                ],
                'filter' => ['ID' => (int)$id],
                'limit' => 1
            ]);

            return $_SERVER['HTTP_HOST'] . '/compilations/' . $item[0]['CODE'] . '/';
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function updateProductAction($data)
    {
        $id = (int)$data[3]['value'];
        $data = array(
            "UF_QUANTITY" => (int)$data[2]['value'],
            "UF_DISCOUNT" => (int)$data[1]['value'],
            "UF_BASE_PRICE" => (int)$data[0]['value'],
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION_PRODUCTS));
            $result = $hlblock->updateElement($id, $data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function delProductAction($id)
    {
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION_PRODUCTS));
            $result = $hlblock->deleteElement($id);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function clearClientAction($id)
    {
        $dt = new DateTime();
        $data = array(
            "UF_UPDATE" => $dt,
            "UF_CLIENT_NAME" => '',
            "UF_CLIENT_PHONE" => '',
            "UF_CLIENT_EMAIL" => '',
            "UF_COMMENT" => '',
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->updateElement($id, $data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function clearProductsAction($id)
    {
        $dt = new DateTime();
        $data = array(
            "UF_COMPILATION_ITEMS" => '',
            "UF_UPDATE" => $dt,
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->updateElement($id, $data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function updatePriceTotalAction($data)
    {
        $id = (int)$data[2]['value'];
        $dt = new DateTime();
        $data = array(
            "UF_PRICE" => (int)$data[1]['value'],
            "UF_DISCOUNT_PERCENT" => (int)$data[0]['value'],
            "UF_UPDATE" => $dt,
        );
        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $result = $hlblock->updateElement($id, $data);
            return $result;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }

    public function newPdfSelectionAction($id)
    {

        try {
            $hlblock = new Hlblock(Hlblock::getIdByName(self::COLLECTION));
            $arFilter['ID'] = $id;
            $items = $hlblock->getList([
                'select' => [
                    'ID',
                    'COMPILATION_ITEMS' => 'UF_COMPILATION_ITEMS',
                    'CLIENT_PHONE' => 'UF_CLIENT_PHONE',
                    'CLIENT_EMAIL' => 'UF_CLIENT_EMAIL',
                    'CLIENT_NAME' => 'UF_CLIENT_NAME',
                    'DISCOUNT_PERCENT' => 'UF_DISCOUNT_PERCENT',
                    'COMMENT' => 'UF_COMMENT',
                    'PRICE' => 'UF_PRICE',
                    'NAME' => 'UF_NAME',
                ],
                'filter' => $arFilter,
                'limit' => 1
            ]);
            $compilationList = \CBitrixComponent::includeComponentClass('fouro:compilation.list');
            $compilation = $compilationList::GetList($items);

            $header = '<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" type="text/css" href="./local/markup/css/pdf.css">

    <style>
        *,
        ::after,
        ::before {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-family: "DejaVu Sans", sans-serif;
        }

        body {
            margin: 0;
            font-weight: 400;
            color: #000;
        }

        a,
        span,
        p {
            padding: 0;
            margin: 0;
        }

        .header {
            padding: 0;
            display: table;
            vertical-align: middle;
            width: 100%;
            color: #000;
            border-bottom: solid 1px #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .logo img {
            width: 270px;
            margin-right: 20px;
        }

        .logo {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
            width: calc(100% /3);
            text-align: left;
        }

        .adress {
            font-size: 11px;
            line-height: 14px;
            color: #000;
            display: table-cell;
            vertical-align: middle;
            text-align: left;
            width: calc(100% /3);
            white-space: nowrap;
        }

        .adress__col .name {
            font-size: 12px;
            line-height: 14px;
            text-transform: uppercase;
        }

        .adress__col {
            display: inline-block;
            vertical-align: middle;
            padding: 0 10px;
        }

        .phone a img {
            width: 18px;
            height: 18px;
            vertical-align: middle;
            display: inline-block;
            margin-right: 5px;
        }

        .phone a {
            border: solid 1px #000;
            border-radius: 12px;
            padding: 10px 25px;
            color: #000;
            text-decoration: none;
            vertical-align: middle;
            display: inline-block;
            font-size: 14px;
            line-height: 15px;
        }

        .phone {
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            text-decoration: none;
            width: calc(100% /3);
        }

        .phone__text {
            vertical-align: middle;
            display: inline-block;
        }

        .card-media-big {
            width: 100%;
            height: 350px;
            border-radius: 20px;
            overflow: hidden;
            margin-bottom: 16px;
            display: table;
        }

        .card-media-small+.card-media-small {
            margin-left: 10px;
        }

        .card-media-small {
            width: 165px;
            border-radius: 20px;
            overflow: hidden;
            margin-top: 40px;
        }

        .card {
            display: table;
        }

        .card__left {
            width: 350px;
            display: table-cell;
            vertical-align: top;
        }

        .card__right {
            display: table-cell;
            vertical-align: top;
            padding-left: 30px;
        }


        .card__info {
            font-size: 14px;
            line-height: 18px;
            letter-spacing: 0.03em;
            margin-top: 10px;
            display: table;
            width: 100%;
        }

        .card__info .title {
            font-size: 15px;
            line-height: 18px;
            text-transform: uppercase;
            display: table;
        }


        .card__info .row {
            display: table;
            width: 100%;
        }

        .card__info .col {
            display: table-cell;
            padding: 6px 0;
            width: 50%;
        }

        .card__info a {
            font-size: 14px;
            line-height: 18px;
            letter-spacing: 0.03em;
            display: table;
            color: #000;

        }

        .card__info strong {
            font-size: 16px;
            line-height: 20px;
            text-transform: uppercase;
            display: block;
        }

        .card__info>strong {
            margin-top: 10px;
        }

        .card__code {
            font-size: 16px;
            line-height: 20px;
            color: rgba(0, 0, 0, .48);
        }

        .card__link {
            font-size: 14px;
            line-height: 18px;
            letter-spacing: 0.03em;
            color: #000;
            display: table;
            margin-top: 10px;
            text-decoration-skip-ink: none;
        }

        .card__status {
            font-size: 12px;
            line-height: 16px;
            letter-spacing: 0.03em;
            margin-top: 10px;
        }

        .card__count {
            color: #000;
        }

        .card__nal.nalihie::before {
            background-color: #0B8A4D;
        }

        .card__nal.nalihie {
            color: #0B8A4D;
        }

        .card__nal {
            position: relative;
        }

        .card__stat {
            font-size: 12px;
            line-height: 14px;
            letter-spacing: 0.01em;
            color: rgba(0, 0, 0, .48);
        }

        .card__price {
            margin-top: 10px;
        }

        .card__price .price {
            font-size: 18px;
            line-height: 20px;
            letter-spacing: 0.03em;

        }

        .card__price .price.new {
            color: #BB0909;
        }

        .card__price .price.old {
            text-decoration: line-through;
            color: rgba(0, 0, 0, .48);
            margin-left: 35px;

        }

        .salons {
            margin-top: 30px;
            font-size: 14px;
            line-height: 20px;
        }

        .salons__title {
            font-size: 16px;
            line-height: 20px;
            text-transform: uppercase;
        }

        .salons .row {
            display: table;
            width: 100%;
            margin-top: 30px;
        }

        .salons .col {
            display: table-cell;
            vertical-align: top;
            padding-right: 120px;
        }

        .salons .name {
            text-transform: uppercase;
            font-size: 16px;
            line-height: 20px;
            white-space: nowrap;
        }

        .salons .metro img {
            width: 12px;
            height: 12px;
            object-fit: contain;
        }

        .salons .metro {
            display: table;
            vertical-align: middle;
            font-size: 12px;
            line-height: 16px;
            letter-spacing: 0.03em;
            margin: 5px 0;
        }

        .salons strong {}

        .salons a {
            display: table;
            color: #000;
            text-decoration-skip-ink: none;

        }

        .about {
            display: table;
            margin-top: 50px;
            width: 100%;
        }

        .about img {
            display: table-cell;
            vertical-align: middle;
            width: 365px;
            height: 200px;
            overflow: hidden;
            border-radius: 20px;
        }

        .about__info {
            display: table-cell;
            vertical-align: middle;
            padding-left: 30px;
            width: 640px;
        }

        .about__info .title {
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0.03em;
            text-transform: uppercase;
        }


        .about__info .row {
            margin-top: 30px;
            display: table;
            width: 100%;
        }

        .about__info .col {
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.03em;
            display: table-cell;
            vertical-align: middle;
            padding-right: 10px;
        }

        .footer__text p {
            width: 320px;
            margin-left: auto;
        }

        .footer__text {
            display: table-cell;
            vertical-align: middle;
            width: 320px;
            font-size: 14px;
            line-height: 20px;
        }

        .footer .logo {
            display: table-cell;
            vertical-align: middle;
        }

        .footer {
            display: table;
            vertical-align: middle;
            width: 100%;
            font-size: 16px;
            line-height: 27px;
            margin-top: 50px;

        }
    </style>

</head>

<body>
    <div style="font-family: DejaVu Sans, sans-serif;max-width: 1030px;margin: 0 auto;">
        <div class="header">
            <div class="logo">
                <img src="https://interior-market.ru/local/markup/img/logo3.svg" alt="logo">
            </div>

            <div class="adress">
                <div class="adress__col">
                    <span class="name">салон antoniolupi</span>
                    <p>Ростовская наб., 5</p>
                </div>
                <div class="adress__col">
                    <span class="name">салон gessi</span>
                    <p>Кутузовский пр-т 2/1с1</p>
                </div>
                <div class="adress__col">
                    <span class="name">салон interror market</span>
                    <p>Ростовская наб., 1</p>
                </div>

            </div>

            <div class="phone">
                <a href="tel:+74952662533">
                    <img src="https://interior-market.ru/local/markup/img/phone.svg" alt="logo">
                    <span class="phone__text">+7 (495) 266-25-33</span>
                </a>
            </div>
        </div>

        <div class="card">
            <div class="card__left">
                <img class="card-media-big"
                    src="https://interior-market.ru/upload/iblock/4c6/xznm6wkg9uz0rx3btjkuh8z9cftc1cp3.jpg" alt="">
                <img class="card-media-small"
                    src="https://interior-market.ru/upload/iblock/4c6/xznm6wkg9uz0rx3btjkuh8z9cftc1cp3.jpg" alt="">
                <img class="card-media-small"
                    src="https://interior-market.ru/upload/iblock/4c6/xznm6wkg9uz0rx3btjkuh8z9cftc1cp3.jpg" alt="">


            </div>
            <div class="card__right">
                <span class="card__code">код 333798</span>
                <a href="#" class="card__link">ДИВАН MINOTTI ALEXANDER & ALEXANDER "DROP" ALELET185S G + ALDMCL165D G -
                    ткань -
                    cat.G art.Kita</a>
                <div class="card__status">
                    <span class="card__nal nalihie">
                        <span>в наличии</span>
                        <span class="card__count">— 1шт.</span>
                    </span>
                    <span class="card__stat">Товар на экспозиции</span>
                </div>
                <div class="card__price">
                    <span class="price new">2 991 712₽</span>
                    <span class="price old">4 273 875₽</span>
                </div>
                <div class="card__info">
                    <span class="title">Описание</span>

                    <strong>о товаре</strong>
                    <p>
                        Диван из 2х модулей-левый элемент прямой 187смс низкой спинкой+правый элемент закругленный
                        шезлонг167см с высокой спинкой
                    </p>
                    <strong>отделка</strong>
                    <p>
                        ткань-cat.G art.Kita melange col.Grafite 02
                    </p>

                    <div class="row">
                        <div class="col">
                            <strong>материал</strong>
                            <p>Ткань</p>
                        </div>
                        <div class="col">
                            <strong>Цвет</strong>
                            <p>Серый</p>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <strong>Бренд</strong>
                            <a href="#">Minotti</a>
                        </div>
                        <div class="col">
                            <strong>Модель</strong>
                            <a href="#">Alexander & </a>
                            <a href="#">Alexander "Drop"</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <strong>Размер</strong>
                            <p>354*144/105*79</p>
                        </div>
                        <div class="col">
                            <strong>Дизайнер</strong>
                            <a href="#">Rodolfo Dordoni</a>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col">
                            <strong>Артикул</strong>
                            <p>ALELET185S G +ALDMCL165D G</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="salons">
            <span class="salons__title">Наши салоны</span>

            <div class="row">
                <div class="col">
                    <span class="name">салон antoniolupi</span>
                    <span class="metro"> <img src="https://interior-market.ru/local/markup/img/metro.png" alt="metro" />
                        Смоленская, Киевская</span>
                    <strong>Контакты</strong>
                    <a href="tel:+74952662533">+7 (495) 266-25-33</a>
                    <strong>Адрес</strong>
                    <p>Россия, 119121, г. Москва, Ростовская наб., 5</p>
                </div>
                <div class="col">
                    <span class="name">салон gessi</span>
                    <span class="metro"><img src="https://interior-market.ru/local/markup/img/metro.png" alt="metro" />
                        Смоленская, Киевская</span>
                    <strong>Контакты</strong>
                    <a href="tel:+74951279599">+7 (495) 127-95-99</a>
                    <strong>Адрес</strong>
                    <p>Россия, 121248, г. Москва,
                        Кутузовский пр-т 2/1с1</p>
                </div>
                <div class="col">
                    <span class="name">салон interror market</span>
                    <span class="metro"><img src="https://interior-market.ru/local/markup/img/metro.png" alt="metro" />
                        Смоленская, Парк Культуры</span>
                    <strong>Контакты</strong>
                    <a href="tel:+74951504564">+7 (495) 150-45-64</a>
                    <strong>Адрес</strong>
                    <p>Россия, 119121, г. Москва,
                        Ростовская наб., 1</p>
                </div>
            </div>
        </div>

        <div class="about">

            <img src="https://interior-market.ru/local/markup/img/pdf-about-img.jpg" alt="">

            <div class="about__info">
                <span class="title">о нас в цифрах</span>

                <div class="row">
                    <div class="col">
                        <p>Более 20 лет успешной работы</p>
                    </div>
                    <div class="col">
                        <p>Более 12000 товаров, представленных
                            в экспозиции</p>
                    </div>
                    <div class="col">
                        <p>Более
                            1800 м²
                            площадь
                            салона</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="logo">
                <img src="https://interior-market.ru/local/markup/img/logo3.svg" alt="logo">
            </div>

            <div class="footer__text">
                <p>
                    Цены носят информационный характер,
                    не является публичной офертой.
                </p>
            </div>
        </div>
    </div>
    </div>
</body>

</html>';

            $html = $header;
            ob_end_clean();
            $dompdf = new Dompdf(['chroot' => $_SERVER['DOCUMENT_ROOT']]);
            //$dompdf = new Dompdf();
            $dompdf->setBasePath($_SERVER['DOCUMENT_ROOT'] . '/');
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->set_option('isRemoteEnabled', TRUE);
            $dompdf->loadHtml($html, 'UTF-8');
            $dompdf->render();

            $pdf = $dompdf->output();
            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/compilations/pdf/121212.pdf', $pdf);


            $fp = fopen($_SERVER['DOCUMENT_ROOT'] . '/compilations/pdf/121212.pdf', 'rb');

            $filePath = $_SERVER['DOCUMENT_ROOT'] . '/compilations/pdf/121212.pdf';

            header("Cache-Control: ");
            header("Pragma: ");
            header("Content-Type: application/octet-stream");
            header("Content-Length: " . filesize($_SERVER['DOCUMENT_ROOT'] . '/compilations/pdf/121212.pdf'));
            header("Content-Disposition:attachment;filename=\"121212.pdf\"");
            header("Content-Transfer-Encoding: binary\n");

            $binaryData = file_get_contents($filePath);
            $base64String = base64_encode($binaryData);
            $response = array('status' => true, 'pdfData' => $base64String);
            //            echo json_encode($response);
            //            echo  json_encode( $filePath);

            return $response;
        } catch (ObjectPropertyException | SystemException | LoaderException $e) {
            return false;
        }
    }
}
