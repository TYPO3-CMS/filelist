<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'TYPO3 CMS Filelist',
    'description' => 'TYPO3 backend module (File>Filelist) used for managing files.',
    'category' => 'module',
    'state' => 'stable',
    'author' => 'TYPO3 Core Team',
    'author_email' => 'typo3cms@typo3.org',
    'author_company' => '',
    'version' => '13.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '13.0.0',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
