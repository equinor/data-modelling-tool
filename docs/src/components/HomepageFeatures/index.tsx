import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";
import { Icon } from '@equinor/eds-core-react'
import { launch, widgets,build_wrench } from '@equinor/eds-icons'

Icon.add({ launch, widgets, build_wrench})

type FeatureItem = {
    title: string;
    icon: React.ComponentType;
    description: string;
    to: string
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Plugin Development',
        icon: (<Icon name="widgets" />),
        to: "/docs/guides/plugin-development",
        description: "Extend and customize"
    },
    {
        title: 'Administration',
        icon: (<Icon name="launch" />),
        description: "Get up and running",
        to: "/docs/guides/administration",
    },
    {
        title: 'Core Development',
        icon: (<Icon name="build_wrench" />),
        description: "Contribute to core functionality",
        to: "/docs/guides/development",
    }
];

function Feature({title, icon, description, to}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <Link
                to={to}>
                <div className="text--center">
                    {icon}
                </div>
                <div className="text--center padding-horiz--md">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </Link>
        </div>
    );

}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
