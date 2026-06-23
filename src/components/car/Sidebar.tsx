import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

type MenuItem = {
  name: string;
  path: string;
  icon: string;
};

interface SidebarProps {
  items: MenuItem[];
}

const MenuItemText = styled.span<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  text-decoration: ${({ active }) => (active ? "underline" : "none")};
`;

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <SidebarContainer collapsed={collapsed}>
      <Header>
        {!collapsed && (
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Menu</span>
        )}
        <ToggleButton onClick={toggleSidebar}>
          {collapsed ? "☰" : "X"}
        </ToggleButton>
      </Header>
      <MenuList>
        {items.map(({ name, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <MenuItemLink key={path} to={path} collapsed={collapsed}>
              <span>{icon}</span>
              {!collapsed && (
                <MenuItemText active={isActive}>{name}</MenuItemText>
              )}
            </MenuItemLink>
          );
        })}
      </MenuList>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? "60px" : "240px")};
  background-color: #f0f0f0;
  color: black;
  height: 100%;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  margin: 16px 16px 16px 16px;
`;

const ToggleButton = styled.button`
  background: none;
  color: black;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const MenuList = styled.nav`
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const MenuItemLink = styled(Link)<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
  padding-left: ${({ collapsed }) => (collapsed ? "0.7rem" : "1rem")};
  border-radius: 8px;
  color: black;
  text-decoration: none;

  &:hover {
    background-color: #ccddff;
  }
`;

export default Sidebar;
