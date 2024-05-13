import { ReactElement } from "react";

export function DummyBanner(props: {
  Root: ReactElement;
  DummyComponent: ReactElement;
  DummyComponentCollection: ReactElement[];
}) {
  const { Root, DummyComponent, DummyComponentCollection } = props;

  return (
    <Root.type {...Root.props}>
      <DummyComponent.type {...DummyComponent.props} />
    </Root.type>
  );
}

export function DummySelectable(props: { Root: ReactElement }) {
  const { Root } = props;
  console.log("DummySelectable", props);

  return <Root.type {...Root.props}>Test</Root.type>;
}
