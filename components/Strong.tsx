import React from 'react';

export function Strong(props: { children: string; hidden?: boolean; className?: string }) {
    return (
        <strong hidden={props.hidden} className={'text-lg md:text-2xl !font-medium ' + props.className}>
            {props.children}
        </strong>
    );
}
