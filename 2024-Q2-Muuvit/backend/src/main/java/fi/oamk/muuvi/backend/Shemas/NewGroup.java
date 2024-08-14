package fi.oamk.muuvi.backend.Shemas;

public class NewGroup {
    private String groupName="";
    private String description="";

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
}
