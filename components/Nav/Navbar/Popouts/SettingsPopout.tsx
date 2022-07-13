import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import shallow from 'zustand/shallow';
import {
    Slider,
    VersionSelector,
    ToggleSwitch,
    SwitchOption,
    DarkModeSelector,
    StyledSettingsPopout,
    ANIMATION_DURATION,
} from '~/components/Nav/Navbar/Popouts/styles';
import { useStore } from '~/store/main';
import { selectThemeSlice } from '~/store/ThemeSlice';

const SettingsPopout: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const router = useRouter();
    const [v2selected, setV2Selected] = useState(true);
    const { isDark, toggleTheme } = useStore(selectThemeSlice, shallow);
    const basePath = 'https://poolsv1.tracer.finance';

    const getRoute = useCallback(() => {
        if (router.route === '/') {
            return `${basePath}/pools`;
        } else {
            // assumes that the destination base path appropriately handles redirects
            return `${basePath}${router.route}`;
        }
    }, [router.route]);

    const handleVersionSwitch = () => {
        setV2Selected(!v2selected);
        // Wait for toggle animation to complete before navigating to v1
        setTimeout(() => {
            open(getRoute(), '_self');
        }, ANIMATION_DURATION * 1000 * 2);
    };

    return (
        <StyledSettingsPopout isActive={isActive}>
            <VersionSelector borderBottom>
                <span>Version Selector</span>
                <ToggleSwitch onClick={handleVersionSwitch}>
                    <SwitchOption selected={!v2selected}>V1</SwitchOption>
                    <SwitchOption selected={v2selected}>V2</SwitchOption>
                    <Slider isSwitchedOn={v2selected} />
                </ToggleSwitch>
            </VersionSelector>
            <DarkModeSelector>
                <span>Dark Mode</span>
                <ToggleSwitch onClick={toggleTheme}>
                    <SwitchOption selected={!isDark}>Off</SwitchOption>
                    <SwitchOption selected={isDark}>On</SwitchOption>
                    <Slider isSwitchedOn={isDark} />
                </ToggleSwitch>
            </DarkModeSelector>
        </StyledSettingsPopout>
    );
};

export default SettingsPopout;
