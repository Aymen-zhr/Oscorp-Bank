<?php

return [
    'steps' => [
        [
            'id' => 'contact',
            'label' => 'Contact',
            'icon' => 'Phone',
            'fields' => [
                [
                    'name' => 'phone',
                    'label' => 'Primary Contact Number',
                    'type' => 'tel',
                    'placeholder' => 'e.g., +212 600 000 000',
                    'required' => true,
                    'icon' => 'Phone',
                ],
            ],
        ],
        [
            'id' => 'professional',
            'label' => 'Professional',
            'icon' => 'Briefcase',
            'fields' => [
                [
                    'name' => 'job_title',
                    'label' => 'Professional Title',
                    'type' => 'autocomplete',
                    'options_key' => 'job_titles',
                    'placeholder' => 'What is your occupation?',
                    'required' => true,
                    'icon' => 'Briefcase',
                ],
                [
                    'name' => 'address',
                    'label' => 'Residential Address',
                    'type' => 'autocomplete',
                    'options_key' => 'moroccan_addresses',
                    'placeholder' => 'Where do you live?',
                    'required' => true,
                    'icon' => 'MapPin',
                ],
            ],
        ],
        [
            'id' => 'identity',
            'label' => 'Identity',
            'icon' => 'IdCard',
            'fields' => [
                [
                    'name' => 'cin',
                    'label' => 'National ID Card Number (CIN)',
                    'type' => 'text',
                    'placeholder' => 'e.g., AB123456',
                    'required' => true,
                    'icon' => 'IdCard',
                ],
                [
                    'name' => 'date_of_birth',
                    'label' => 'Date of Birth',
                    'type' => 'date',
                    'required' => true,
                    'icon' => 'Calendar',
                ],
            ],
        ],
        [
            'id' => 'origin',
            'label' => 'Origin',
            'icon' => 'Flag',
            'fields' => [
                [
                    'name' => 'place_of_birth',
                    'label' => 'Place of Birth',
                    'type' => 'autocomplete',
                    'options_key' => 'moroccan_cities',
                    'placeholder' => 'City of birth',
                    'required' => true,
                    'icon' => 'Map',
                ],
                [
                    'name' => 'nationality',
                    'label' => 'Nationality',
                    'type' => 'autocomplete',
                    'options_key' => 'nationalities',
                    'placeholder' => 'Your nationality',
                    'required' => true,
                    'icon' => 'Flag',
                ],
            ],
        ],
        [
            'id' => 'personal',
            'label' => 'Personal',
            'icon' => 'Users',
            'fields' => [
                [
                    'name' => 'gender',
                    'label' => 'Gender',
                    'type' => 'select',
                    'options' => [
                        ['value' => 'male', 'label' => 'Male'],
                        ['value' => 'female', 'label' => 'Female'],
                    ],
                    'required' => true,
                    'icon' => 'Users',
                ],
            ],
        ],
        [
            'id' => 'avatar',
            'label' => 'Avatar',
            'icon' => 'Camera',
            'fields' => [
                [
                    'name' => 'avatar',
                    'label' => 'Profile Photo',
                    'type' => 'file',
                    'required' => false,
                    'icon' => 'Camera',
                ],
            ],
        ],
    ],
];
